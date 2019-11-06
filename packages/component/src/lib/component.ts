import { Injector, ClassProviderToken } from '@lit-kit/di';
import { TemplateResult, render, html } from 'lit-html';

import { CompState } from './state';
import { ElRefToken } from './el-ref';
import {
  OnPropChanges,
  OnInit,
  OnConnected,
  OnDisconnected,
  OnAttributeChanged
} from './lifecycle';

export type TemplateDef<T> = (
  state: T,
  run: (event: string, ...args: unknown[]) => (e: Event) => void
) => TemplateResult;

export interface ComponentConfig<T> {
  tag: string;
  template: TemplateDef<T>;
  defaultState: T;
  style?: TemplateResult;
  observedAttributes?: string[];
}

export type ComponentInstance = Partial<OnPropChanges> &
  Partial<OnInit> &
  Partial<OnConnected> &
  Partial<OnDisconnected> &
  Partial<OnAttributeChanged> & {
    props: string[];
    handlers: { [key: string]: Function };
    [key: string]: any;
  };

export type ElementInstance<T> = {
  componentInjector: Injector;
  componentInstance: ComponentInstance;
  componentState: CompState<T>;
  [key: string]: any;
} & HTMLElement;

export type ComponentDef<T> = ClassProviderToken<T> & { tag?: string };

export const createComponent = <T>(componentDef: ComponentDef<any>) => {
  return document.createElement(componentDef.tag as string) as ElementInstance<T>;
};

export const Component = <T = any>(config: ComponentConfig<T>) => (
  componentDef: ComponentDef<any>
) => {
  componentDef.tag = config.tag;

  customElements.define(
    config.tag,
    class extends HTMLElement implements ElementInstance<T> {
      static observedAttributes = config.observedAttributes;

      public componentInstance: ComponentInstance;

      public componentState: CompState<T>;

      public componentInjector = new Injector(
        {
          providers: [
            { provide: ElRefToken, useFactory: () => this },
            {
              provide: CompState,
              useFactory: () => {
                return new CompState<T>(state => {
                  const template = html`
                    ${config.style} ${config.template(state, this.run)}
                  `;

                  render(template, this.shadow);
                }, config.defaultState);
              }
            }
          ]
        },
        window.ROOT__INJECTOR__ // The root injector is global
      );

      private shadow = this.attachShadow({ mode: 'open' });

      private run = (eventName: string, payload: unknown) => (e: Event) => {
        if (eventName in this.componentInstance.handlers) {
          this.componentInstance.handlers[eventName].call(this.componentInstance, e, payload);
        }
      };

      constructor() {
        super();

        const template = html`
          ${config.style} ${config.template(config.defaultState, this.run)}
        `;

        render(template, this.shadow);

        this.componentInstance = this.componentInjector.create(componentDef);

        this.componentInstance.props = this.componentInstance.props || [];

        this.componentState = this.componentInjector.get(CompState);

        for (let i = 0; i < this.componentInstance.props.length; i++) {
          const prop = this.componentInstance.props[i];

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
