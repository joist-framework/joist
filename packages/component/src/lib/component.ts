import { Injector, ClassProviderToken } from '@lit-kit/di';
import { html } from 'lit-html';

import { Renderer } from './renderer';
import { State } from './state';
import { ElRefToken } from './el-ref';
import { getApplicationRef } from './app';
import { Metadata, getMetadataRef, ComponentConfig } from './metadata';
import {
  OnPropChanges,
  OnInit,
  OnConnected,
  OnDisconnected,
  OnAttributeChanged
} from './lifecycle';

export type ComponentInstance<T> = T &
  Partial<OnPropChanges> &
  Partial<OnInit> &
  Partial<OnConnected> &
  Partial<OnDisconnected> &
  Partial<OnAttributeChanged> & { [key: string]: any };

export type ElementInstance<C, S> = {
  componentInjector: Injector;
  componentInstance: ComponentInstance<C>;
  componentMetaData: Metadata<S>;
  componentState: State<S>;
  [key: string]: any;
} & HTMLElement;

function mapComponentProperties<T>(el: ElementInstance<any, T>) {
  const metadata = el.componentMetaData;
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

export function Component<T = any>(config: ComponentConfig<T>) {
  return function(componentDef: ClassProviderToken<any>) {
    type ComponentDef = typeof componentDef;

    const stylesString = config.styles ? config.styles.join('') : '';
    const componentProviders = config.providers || [];
    const componentMetaData = getMetadataRef<T>(componentDef);

    componentMetaData.config = config;

    class LitKitElement extends HTMLElement implements ElementInstance<ComponentDef, T> {
      static observedAttributes = config.observedAttributes;

      public componentInstance: ComponentInstance<ComponentDef>;
      public componentState: State<T>;
      public componentMetaData = componentMetaData;
      public componentInjector = new Injector(
        {
          providers: componentProviders.concat([
            { provide: ElRefToken, useFactory: () => this, deps: [] },
            { provide: State, useFactory: () => new State(config.defaultState), deps: [] }
          ])
        },
        getApplicationRef()
      );

      constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });
        const run = (eventName: string, payload: unknown) => (e: Event) => {
          if (eventName in this.componentMetaData.handlers) {
            this.componentMetaData.handlers[eventName].call(this.componentInstance, e, payload);
          }
        };

        this.componentInstance = this.componentInjector.create(componentDef);
        this.componentState = this.componentInjector.get(State);

        const renderer = this.componentInjector.get(Renderer);

        const componentRender = (state: T, styles: string) => {
          renderer.render(
            html`
              <style>
                ${styles}
              </style>

              ${config.template(state, run)}
            `,
            shadow,
            { scopeName: this.tagName.toLowerCase(), eventContext: this }
          );
        };

        componentRender(config.defaultState, stylesString);

        this.componentState.onChange(state => {
          componentRender(state, stylesString);
        });

        // Define setters and getters to map custom element properties to component properties
        mapComponentProperties(this);

        if (this.componentInstance.onInit) {
          this.componentInstance.onInit();
        }
      }

      connectedCallback() {
        if (window.ShadyCSS) {
          window.ShadyCSS.styleElement(this);
        }

        if (this.componentInstance.connectedCallback) {
          this.componentInstance.connectedCallback();
        }
      }

      disconnectedCallback() {
        if (this.componentInstance.disconnectedCallback) {
          this.componentInstance.disconnectedCallback();
        }
      }

      attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
        if (this.componentInstance.attributeChangedCallback) {
          this.componentInstance.attributeChangedCallback(attrName, oldVal, newVal);
        }
      }
    }

    customElements.define(config.tag, LitKitElement);
  };
}
