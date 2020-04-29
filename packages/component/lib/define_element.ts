import { Injector, ClassProviderToken } from '@joist/di';

import { Renderer } from './renderer';
import { State } from './state';
import { ElRefToken } from './el_ref';
import { getEnvironmentRef } from './environment';
import { Lifecycle } from './lifecycle';
import {
  getComponentMetadata,
  TemplateEvent,
  getComponentDef,
  ComponentMetadata,
  ComponentDef,
} from './metadata';

export type ComponentInstance<T> = T & Lifecycle;

export type ElementInstance<Component> = HTMLElement & {
  componentInjector: Injector;
  componentInstance: ComponentInstance<Component>;
  [key: string]: any;
};

function connectComponent<Component, State>(
  el: ElementInstance<Component>,
  componentMetadata: ComponentMetadata,
  componentDef: ComponentDef<any>
) {
  if ((window as any).ShadyCSS) {
    (window as any).ShadyCSS.styleElement(el);
  }

  const base = el.shadowRoot || el;
  const renderer = el.componentInjector.get(Renderer);
  const renderOptions = { scopeName: el.tagName.toLowerCase(), eventContext: el };

  const run: TemplateEvent = (eventName: string, payload: unknown) => (e: Event) => {
    if (eventName in componentMetadata.handlers) {
      componentMetadata.handlers[eventName].call(el.componentInstance, e, payload);
    }
  };

  const dispatch = (eventName: string, detail: unknown) => () => {
    el.dispatchEvent(new CustomEvent(eventName, { detail }));
  };

  const componentRender = (state: State) => {
    renderer.render(componentDef.template({ state, run, dispatch }), base, renderOptions);
  };

  componentRender(el.componentInjector.get(State).value);

  el.componentInjector.get(State).onChange((state) => {
    componentRender(state);
  });
}

export interface DefineElementOptions {
  extends: typeof HTMLElement;
}

export function defineElement<T>(
  component: ClassProviderToken<any>,
  options: DefineElementOptions = { extends: HTMLElement }
) {
  const componentDef = getComponentDef<T>(component);
  const componentMetadata = getComponentMetadata(component);
  const componentProviders = componentDef.providers || [];

  const LitKitElement = class extends options.extends implements ElementInstance<any> {
    static observedAttributes = componentDef.observedAttributes;

    public componentInjector = new Injector(
      {
        providers: componentProviders.concat([
          { provide: ElRefToken, useFactory: () => this, deps: [] },
          { provide: State, useFactory: () => new State(componentDef.initialState), deps: [] },
        ]),
        bootstrap: componentProviders.map((p) => p.provide),
      },
      getEnvironmentRef()
    );

    public componentInstance: ComponentInstance<typeof component> = this.componentInjector.create(
      component
    );

    constructor() {
      super();

      if (componentDef.useShadowDom) {
        this.attachShadow({ mode: 'open' });
      }
    }

    public connectedCallback() {
      connectComponent(this, componentMetadata, componentDef);

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
  };

  /**
   * Map custom element properties to component instance properties.
   * Only maps properties that are decorated with the @Prop() decorator.
   *
   * NOTE: This kind of seems like code smell.
   * It is well tested so attempt to refactor
   */
  for (let i = 0; i < componentMetadata.props.length; i++) {
    const prop = componentMetadata.props[i];

    Object.defineProperty(LitKitElement.prototype, prop, {
      set(newValue) {
        const self = this as ElementInstance<any>;
        const instance = self.componentInstance;
        const oldValue = instance[prop];

        instance[prop] = newValue;

        if (instance.onPropChanges) {
          instance.onPropChanges(prop, oldValue, newValue);
        }
      },
      get() {
        const self = this as ElementInstance<any>;

        return self.componentInstance[prop];
      },
    });
  }

  return LitKitElement;
}
