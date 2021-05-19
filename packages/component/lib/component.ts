import { Provider } from '@joist/di';

export const COMPONENT_DEF_KEY = 'componentDef';

export interface RenderCtx<T = unknown, H extends HTMLElement = HTMLElement> {
  state: T;
  run: (event: string | Symbol, payload?: unknown) => (e: Event) => void;
  dispatch: (eventName: string, init?: CustomEventInit) => () => void;
  host: H;
  renderRoot: H | ShadowRoot;
}

export type RenderDef<T, H extends HTMLElement = HTMLElement> = (
  ctx: RenderCtx<T, H>,
  def: ComponentDef<any>
) => unknown;

export interface ComponentDef<T, H extends HTMLElement = HTMLElement> {
  tagName?: string;
  shadowDom?: 'open' | 'closed';
  render?: RenderDef<T, H>;
  styles?: string[];
  state?: T;
  providers?: Provider<any>[];
  isInjectorRoot?: boolean;
}

export function getComponentDef<T>(component: any): ComponentDef<T> {
  return component[COMPONENT_DEF_KEY] || {};
}

export function component<T, H extends HTMLElement = HTMLElement>(
  componentDef: ComponentDef<T, H> = {}
) {
  return function (component: new () => H) {
    Object.defineProperty(component, COMPONENT_DEF_KEY, {
      get() {
        return componentDef;
      },
    });

    if (componentDef.tagName) {
      customElements.define(componentDef.tagName, component);
    }
  };
}
