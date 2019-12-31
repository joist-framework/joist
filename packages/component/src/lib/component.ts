import { Injector, ClassProviderToken } from '@lit-kit/di';
import { html } from 'lit-html';

import { Renderer } from './renderer';
import { State } from './state';
import { ElRefToken } from './el-ref';
import { getApplicationRef } from './app';
import { getMetadataRef, ComponentConfig, Metadata, TemplateEvent } from './metadata';
import { Lifecycle } from './lifecycle';

export type ComponentInstance<T> = T & Lifecycle & { [key: string]: any };

export type ElementInstance<C, S> = HTMLElement & {
  componentInjector: Injector;
  componentInstance: ComponentInstance<C>;
  componentMetadata: Metadata<S>;
  componentState: State<S>;
  [key: string]: any;
};

type ModernStylesheet = {
  new (): CSSStyleSheet;
  replaceSync(css: string): void;
  replace(css: string): Promise<void>;
} & CSSStyleSheet;

const HAS_CONSTRUCTABLE_STYLESHEETS = 'adoptedStyleSheets' in document;

/**
 * Map custom element properties to component instance properties.
 * Only maps properties that are decorated with the @Prop() decorator
 */
function mapComponentProperties<T>(el: ElementInstance<any, T>) {
  const metadata = el.componentMetadata;
  const instance = el.componentInstance;
  const length = metadata.props.length;

  for (let i = 0; i < length; i++) {
    const prop = metadata.props[i];

    Object.defineProperty(el, prop, {
      set: newValue => {
        const oldValue = instance[prop];

        instance[prop] = newValue;

        if (instance.onPropChanges) {
          instance.onPropChanges(prop, oldValue, newValue);
        }
      },
      get: () => instance[prop]
    });
  }
}

function connectComponent<T>(
  el: ElementInstance<any, T>,
  styleSheet: ModernStylesheet | null,
  styleString?: string
) {
  if (styleString && styleSheet && styleSheet.cssRules.length === 0) {
    styleSheet.replaceSync(styleString);
  }

  if ((window as any).ShadyCSS) {
    (window as any).ShadyCSS.styleElement(el);
  }

  const base = el.shadowRoot || el;
  const renderer = el.componentInjector.get(Renderer);
  const config = el.componentMetadata.config as ComponentConfig<T>;
  const renderOptions = { scopeName: el.tagName.toLowerCase(), eventContext: el };

  const run: TemplateEvent = (eventName: string, payload: unknown) => (e: Event) => {
    if (eventName in el.componentMetadata.handlers) {
      el.componentMetadata.handlers[eventName].call(el.componentInstance, e, payload);
    }
  };

  const componentTemplate =
    styleSheet || !config.useShadowDom
      ? (state: T) => html`
          ${config.template(state, run)}
        `
      : (state: T) => html`
          <style>
            ${styleString}
          </style>

          ${config.template(state, run)}
        `;

  const componentRender = (state: T) => {
    renderer.render(componentTemplate(state), base, renderOptions);
  };

  componentRender(el.componentState.value);

  el.componentState.onChange(state => {
    componentRender(state);
  });
}

/**
 * Decorates a class with metadata and defines how a custom element is created.
 *
 * NOTE: since the decorator function is only run once per class type do as much preparation work outside of the custom element itself.
 * This means work like calculating initial styles only needs to be done once.
 */
export function Component<T = any>(config: ComponentConfig<T>) {
  const componentProviders = config.use || [];
  const styleString = config.styles ? config.styles.join('') : '';
  const componentStyleSheet = HAS_CONSTRUCTABLE_STYLESHEETS
    ? ((new CSSStyleSheet() as unknown) as ModernStylesheet)
    : null;

  return function(componentDef: ClassProviderToken<any>) {
    type ComponentDef = typeof componentDef;

    const componentMetaData = getMetadataRef<T>(componentDef);
    componentMetaData.config = config;

    class LitKitElement extends HTMLElement implements ElementInstance<ComponentDef, T> {
      static observedAttributes = config.observedAttributes;

      public componentInjector = new Injector(
        {
          providers: componentProviders.concat([
            { provide: ElRefToken, useFactory: () => this, deps: [] },
            { provide: State, useFactory: () => new State(config.initialState), deps: [] }
          ]),
          bootstrap: componentProviders.map(p => p.provide)
        },
        getApplicationRef()
      );

      public componentMetadata: Metadata<T> = componentMetaData;
      public componentState: State<T> = this.componentInjector.get(State);
      public componentInstance: ComponentInstance<ComponentDef> = this.componentInjector.create(
        componentDef
      );

      constructor() {
        super();

        if (config.useShadowDom) {
          const shadow = this.attachShadow({ mode: 'open' });

          if (HAS_CONSTRUCTABLE_STYLESHEETS) {
            (shadow as any).adoptedStyleSheets = [componentStyleSheet];
          }
        }

        mapComponentProperties(this);
      }

      public connectedCallback() {
        connectComponent(this, componentStyleSheet, styleString);

        if (this.componentInstance.connectedCallback) {
          this.componentInstance.connectedCallback();
        }
      }

      public disconnectedCallback() {
        if (this.componentInstance.disconnectedCallback) {
          this.componentInstance.disconnectedCallback();
        }
      }

      public attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
        if (this.componentInstance.attributeChangedCallback) {
          this.componentInstance.attributeChangedCallback(attrName, oldVal, newVal);
        }
      }
    }

    customElements.define(config.tag, LitKitElement);
  };
}
