import { ProviderToken } from '@lit-kit/di';

import { getMetadataRef } from './metadata';

export function Prop() {
  return function(instance: { constructor: ProviderToken<any> }, key: string) {
    getMetadataRef(instance.constructor).props.push(key);
  };
}
