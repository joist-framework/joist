import { ClassProviderToken } from '@joist/di';

import { ProviderToken, Provider } from '@joist/di';

export const COMPONENT_DEF_KEY = 'componentDef';

export type TemplateEvent = (event: string, ...args: unknown[]) => (e: Event) => void;

export interface TemplateCtx<T> {
  state: T;
  run: TemplateEvent;
  dispatch: (eventName: string, detail?: any) => () => void;
}

export type TemplateDef<T> = (ctx: TemplateCtx<T>) => unknown;

export interface ComponentDef<T> {
  template?: TemplateDef<T>;
  initialState?: T;
  useShadowDom?: boolean;
  observedAttributes?: string[];
  providers?: Provider<any>[];
}

export function getComponentDef<T>(provider: ProviderToken<any>): ComponentDef<T> {
  return provider[COMPONENT_DEF_KEY];
}

export function Component<T>(componentDef: ComponentDef<T>) {
  return function (component: ClassProviderToken<any>) {
    Object.defineProperty(component, COMPONENT_DEF_KEY, {
      get() {
        return componentDef;
      },
    });

    return component;
  };
}
