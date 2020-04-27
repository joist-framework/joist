import { ProviderToken } from '@joist/di';

import { getComponentMetadata } from './metadata';

export function Prop() {
  return function (instance: { constructor: ProviderToken<any> }, key: string) {
    getComponentMetadata(instance.constructor).props.push(key);
  };
}
