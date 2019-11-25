import { Injector, ClassProviderToken } from '@lit-kit/di';
import { html } from 'lit-html';

import { Renderer } from './renderer';
import { State } from './state';
import { ElRefToken } from './el-ref';
import { getApplicationRef } from './app';
import { getMetadataRef, ComponentConfig, Metadata } from './metadata';
import { Lifecycle } from './lifecycle';

export type ComponentInstance<T> = T & Lifecycle & { [key: string]: any };

export type ElementInstance<C, S> = HTMLElement & {
  componentInjector: Injector;
  componentInstance: ComponentInstance<C>;
  componentMetadata: Metadata<S>;
  componentState: State<S>;
  [key: string]: any;
};

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

/**
 * Decorates a class with metadata and defines how a custom element is created.
 *
 * NOTE: since the decorator function is only run once per class type do as much preparation work outside of the custom element itself.
 * This means work like calculating initial styles only needs to be done once.
 */
export function Component<T = any>(config: ComponentConfig<T>) {
  const stylesString = config.styles ? config.styles.join('') : '';
  const componentProviders = config.use || [];

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

        if ('useShadowDom' in config) {
          if (config.useShadowDom) {
            this.attachShadow({ mode: 'open' });
          }
        } else {
          this.attachShadow({ mode: 'open' });
        }

        mapComponentProperties(this);
      }

      public connectedCallback() {
        const base = this.shadowRoot || this;

        if ((window as any).ShadyCSS) {
          (window as any).ShadyCSS.styleElement(this);
        }

        const renderer = this.componentInjector.get(Renderer);
        const run = (eventName: string, payload: unknown) => (e: Event) => {
          if (eventName in this.componentMetadata.handlers) {
            this.componentMetadata.handlers[eventName].call(this.componentInstance, e, payload);
          }
        };

        const componentRender = (state: T, styles: string) => {
          renderer.render(
            html`
              <style>
                ${styles}
              </style>

              ${config.template(state, run)}
            `,
            base,
            { scopeName: this.tagName.toLowerCase(), eventContext: this }
          );
        };

        componentRender(this.componentState.value, stylesString);

        this.componentState.onChange(state => {
          componentRender(state, stylesString);
        });

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
