import { Injector, ClassProviderToken } from '@lit-kit/di';
import { html } from 'lit-html';

import { Renderer } from './renderer';
import { State } from './state';
import { ElRefToken } from './el-ref';
import { getEnvironmentRef } from './environment';
import { getMetadataRef, ComponentConfig, Metadata, TemplateEvent } from './metadata';
import { Lifecycle } from './lifecycle';

export type ComponentInstance<T> = T & Lifecycle & { [key: string]: any };

export type ElementInstance<T> = HTMLElement & {
  componentInjector: Injector;
  componentInstance: ComponentInstance<T>;
  componentMetadata: Metadata;
  [key: string]: any;
};

/**
 * Map custom element properties to component instance properties.
 * Only maps properties that are decorated with the @Prop() decorator
 */
function mapComponentProperties(el: ElementInstance<any>) {
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

function connectComponent<T>(el: ElementInstance<T>, config: ComponentConfig<T>) {
  if ((window as any).ShadyCSS) {
    (window as any).ShadyCSS.styleElement(el);
  }

  const base = el.shadowRoot || el;
  const renderer = el.componentInjector.get(Renderer);
  const renderOptions = { scopeName: el.tagName.toLowerCase(), eventContext: el };

  const run: TemplateEvent = (eventName: string, payload: unknown) => (e: Event) => {
    if (eventName in el.componentMetadata.handlers) {
      el.componentMetadata.handlers[eventName].call(el.componentInstance, e, payload);
    }
  };

  const dispatch = (eventName: string, detail: unknown) => () => {
    el.dispatchEvent(new CustomEvent(eventName, { detail }));
  };

  const componentRender = (state: T) => {
    renderer.render(html`${config.template(state, run, dispatch)}`, base, renderOptions);
  };

  componentRender(el.componentState.value);

  el.componentInjector.get(State).onChange(state => {
    componentRender(state);
  });
}

export function defineComponent<T>(config: ComponentConfig<T>, componentDef: ClassProviderToken<any>) {
  const componentProviders = config.use || [];
  
  return class extends HTMLElement implements ElementInstance<T> {
    static observedAttributes = config.observedAttributes;

    public componentInjector = new Injector(
      {
        providers: componentProviders.concat([
          { provide: ElRefToken, useFactory: () => this, deps: [] },
          { provide: State, useFactory: () => new State(config.initialState), deps: [] }
        ]),
        bootstrap: componentProviders.map(p => p.provide)
      },
      getEnvironmentRef()
    );

    public componentMetadata: Metadata = getMetadataRef(componentDef);
    public componentState: State<T> = this.componentInjector.get(State);
    public componentInstance: ComponentInstance<T> = this.componentInjector.create(
      componentDef
    );

    constructor() {
      super();

      if (config.useShadowDom) {
        this.attachShadow({ mode: 'open' })
      }

      mapComponentProperties(this);
    }

    public connectedCallback() {
      connectComponent(this, config);

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
};