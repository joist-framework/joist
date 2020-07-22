import { ProviderToken, Provider } from '@joist/di';

export const COMPONENT_DEF_KEY = 'componentDef';

export interface RenderCtx<T = unknown> {
  state: T;
  run: (event: string, ...args: unknown[]) => (e: Event) => void;
  dispatch: (eventName: string, init?: CustomEventInit) => () => void;
  host: HTMLElement;
}

export type RenderDef<T> = (ctx: RenderCtx<T>) => unknown;

export interface ComponentDef<T> {
  render?: RenderDef<T>;
  state?: T;
  providers?: Provider<any>[];
}

export function getComponentDef<T>(provider: ProviderToken<any>): ComponentDef<T> {
  return provider[COMPONENT_DEF_KEY] || {};
}

export function Component<T>(componentDef: ComponentDef<T> = {}) {
  return function (component: any) {
    Object.defineProperty(component, COMPONENT_DEF_KEY, {
      get() {
        return componentDef;
      },
    });
  };
}
