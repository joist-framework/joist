import { Provider, Injector } from '@joist/di';

export const COMPONENT_DEF_KEY = 'componentDef';

export interface RenderCtx<T = unknown> {
  state: T;
  run: (event: string, ...payload: any) => (e: Event) => void;
  dispatch: (eventName: string, init?: CustomEventInit) => () => void;
  host: HTMLElement;
}

export type RenderDef<T> = (ctx: RenderCtx<T>) => unknown;

export interface ComponentDef<T> {
  tagName?: string;
  shadowDom?: 'open' | 'closed';
  render?: RenderDef<T>;
  state?: T;
  providers?: Provider<any>[];
  parent?: Injector;
}

export function getComponentDef<T>(provider: any): ComponentDef<T> {
  return provider[COMPONENT_DEF_KEY] || {};
}

export function Component<T>(componentDef: ComponentDef<T> = {}) {
  return function (component: CustomElementConstructor) {
    if (componentDef.tagName) {
      customElements.define(componentDef.tagName, component);
    }

    Object.defineProperty(component, COMPONENT_DEF_KEY, {
      get() {
        return componentDef;
      },
    });
  };
}
