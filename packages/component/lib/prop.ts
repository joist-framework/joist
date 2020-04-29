import { ProviderToken } from '@joist/di';

export const COMPONENT_PROPS_KEY = 'props';

export function getComponentProps(provider: ProviderToken<any>): string[] {
  return provider[COMPONENT_PROPS_KEY] || [];
}

export function Prop() {
  return function (instance: { constructor: ProviderToken<any> }, key: string) {
    instance.constructor[COMPONENT_PROPS_KEY] = instance.constructor[COMPONENT_PROPS_KEY] || [];

    instance.constructor[COMPONENT_PROPS_KEY].push(key);
  };
}
