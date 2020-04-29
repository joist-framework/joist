import { ProviderToken } from '@joist/di';

export const COMPONENT_HANDLERS_KEY = 'handlers';

export function getComponentHandlers(provider: ProviderToken<any>): Record<string, Function> {
  return provider[COMPONENT_HANDLERS_KEY] || {};
}

export function Handle(action: string) {
  return function (instance: { constructor: ProviderToken<any>; [key: string]: any }, key: string) {
    instance.constructor[COMPONENT_HANDLERS_KEY] =
      instance.constructor[COMPONENT_HANDLERS_KEY] || {};

    instance.constructor[COMPONENT_HANDLERS_KEY][action] = instance[key];
  };
}
