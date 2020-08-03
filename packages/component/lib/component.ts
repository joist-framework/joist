import { Provider } from '@joist/di';

export const COMPONENT_DEF_KEY = 'componentDef';

export interface RenderCtx<T = unknown, H extends HTMLElement = HTMLElement> {
  state: T;
  run: (event: string, payload?: unknown) => (e: Event) => void;
  dispatch: (eventName: string, init?: CustomEventInit) => () => void;
  host: H;
}

export type RenderDef<T, H extends HTMLElement = HTMLElement> = (ctx: RenderCtx<T, H>) => unknown;

export interface ComponentDef<T, H extends HTMLElement = HTMLElement> {
  tagName?: string;
  shadowDom?: 'open' | 'closed';
  render?: RenderDef<T, H>;
  state?: T;
  providers?: Provider<any>[];
}

export function getComponentDef<T>(component: any): ComponentDef<T> {
  return component[COMPONENT_DEF_KEY] || {};
}

export function component<T>(componentDef: ComponentDef<T> = {}) {
  return function (component: CustomElementConstructor) {
    Object.defineProperty(component, COMPONENT_DEF_KEY, { value: componentDef });

    if (componentDef.tagName) {
      customElements.define(componentDef.tagName, component);
    }
  };
}
