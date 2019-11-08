import { Injector, ClassProviderToken, ProviderToken } from '@lit-kit/di';
import { render, html } from 'lit-html';

import { CompState } from './state';
import { ElRefToken } from './el-ref';
import { Metadata, readMetadata, ComponentConfig } from './metadata';
import {
  OnPropChanges,
  OnInit,
  OnConnected,
  OnDisconnected,
  OnAttributeChanged
} from './lifecycle';

export type ComponentInstance = Partial<OnPropChanges> &
  Partial<OnInit> &
  Partial<OnConnected> &
  Partial<OnDisconnected> &
  Partial<OnAttributeChanged> & { [key: string]: any };

export type ElementInstance<T> = {
  componentInjector: Injector;
  componentInstance: ComponentInstance;
  componentMetaData: Metadata<T>;
  componentState: CompState<T>;
  [key: string]: any;
} & HTMLElement;

export const createComponent = <T>(componentDef: ProviderToken<any>) => {
  const metadata = readMetadata<T>(componentDef);

  if (!metadata.config) {
    throw new Error(
      `${componentDef.name} is not a Component. Decorate it with the @Component() decorator`
    );
  }

  return document.createElement(metadata.config.tag) as ElementInstance<T>;
};

export const Component = <T = any>(config: ComponentConfig<T>) => (
  componentDef: ClassProviderToken<any>
) => {
  // add component config to metadata
  const componentMetaData = readMetadata<T>(componentDef);
  componentMetaData.config = config;

  customElements.define(
    config.tag,
    class extends HTMLElement implements ElementInstance<T> {
      static observedAttributes = config.observedAttributes;

      public componentInstance: ComponentInstance;
      public componentState: CompState<T>;
      public componentMetaData = componentMetaData;
      public componentInjector = new Injector(
        {
          providers: [
            { provide: ElRefToken, useFactory: () => this, deps: [] },
            { provide: CompState, useFactory: () => new CompState(config.defaultState), deps: [] }
          ]
        },
        window.__LIT_KIT_ROOT_INJECTOR__ // The root injector is global
      );

      constructor() {
        super();

        const run = (eventName: string, payload: unknown) => (e: Event) => {
          if (eventName in this.componentMetaData.handlers) {
            this.componentMetaData.handlers[eventName].call(this.componentInstance, e, payload);
          }
        };

        const shadow = this.attachShadow({ mode: 'open' });

        const template = html`
          ${config.style} ${config.template(config.defaultState, run)}
        `;

        render(template, shadow);

        this.componentInstance = this.componentInjector.create(componentDef);
        this.componentState = this.componentInjector.get(CompState);

        this.componentState.onStateChange(state => {
          const template = html`
            ${config.style} ${config.template(state, run)}
          `;

          render(template, shadow);
        });

        const length = this.componentMetaData.props.length;

        // Define setters and getters to map custom element properties to component properties
        for (let i = 0; i < length; i++) {
          const prop = this.componentMetaData.props[i];

          Object.defineProperty(this, prop, {
            set: value => {
              this.componentInstance[prop] = value;

              if (this.componentInstance.onPropChanges) {
                this.componentInstance.onPropChanges(prop, value);
              }
            },
            get: () => this.componentInstance[prop]
          });
        }

        if (this.componentInstance.onInit) {
          this.componentInstance.onInit();
        }
      }

      connectedCallback() {
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
  );
};
