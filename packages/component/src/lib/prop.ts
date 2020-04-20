import { ProviderToken } from '@lit-kit/di';

import { getComponentMetadataRef } from './metadata';

export function Prop() {
  return function (instance: { constructor: ProviderToken<any> }, key: string) {
    getComponentMetadataRef(instance.constructor).props.push(key);
  };
}
