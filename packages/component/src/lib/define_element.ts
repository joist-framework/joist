import { Injector, ClassProviderToken } from '@lit-kit/di';

import { Renderer } from './renderer';
import { State } from './state';
import { ElRefToken } from './el_ref';
import { getEnvironmentRef } from './environment';
import { Lifecycle } from './lifecycle';
import {
  getComponentMetadataRef,
  ComponentDef,
  ComponentMetadata,
  TemplateEvent,
  getComponentDef,
} from './metadata';

export type ComponentInstance<T> = T & Lifecycle;

export type ElementInstance<Component, State> = HTMLElement & {
  componentInjector: Injector;
  componentInstance: ComponentInstance<Component>;
  componentMetadata: ComponentMetadata;
  componentDef: ComponentDef<State>;
  [key: string]: any;
};

function connectComponent<Component, State>(el: ElementInstance<Component, State>) {
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

  const componentRender = (state: State) => {
    renderer.render(el.componentDef.template(state, run, dispatch), base, renderOptions);
  };

  componentRender(el.componentInjector.get(State).value);

  el.componentInjector.get(State).onChange((state) => {
    componentRender(state);
  });
}

export function defineElement<T>(component: ClassProviderToken<any>) {
  const componentDef = getComponentDef<T>(component);
  const componentMetadata = getComponentMetadataRef(component);
  const componentProviders = componentDef.use || [];

  const LitKitElement = class extends HTMLElement implements ElementInstance<any, T> {
    static observedAttributes = componentDef.observedAttributes;

    public componentDef: ComponentDef<T> = componentDef;
    public componentMetadata: ComponentMetadata = componentMetadata;

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

      // mapComponentProperties(this);
    }

    public connectedCallback() {
      connectComponent(this);

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

  const length = componentMetadata.props.length;

  for (let i = 0; i < length; i++) {
    const prop = componentMetadata.props[i];

    Object.defineProperty(LitKitElement.prototype, prop, {
      set(newValue) {
        const self = this as ElementInstance<any, any>;
        const instance = self.componentInstance;
        const oldValue = instance[prop];

        instance[prop] = newValue;

        if (instance.onPropChanges) {
          instance.onPropChanges(prop, oldValue, newValue);
        }
      },
      get() {
        const self = this as ElementInstance<any, any>;

        return self.componentInstance[prop];
      },
    });
  }

  return LitKitElement;
}
