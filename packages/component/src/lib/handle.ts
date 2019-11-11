import { ProviderToken } from '@lit-kit/di';

import { getMetadataRef } from './metadata';

export function Handle(action: string) {
  return function(instance: { constructor: ProviderToken<any>; [key: string]: any }, key: string) {
    getMetadataRef(instance.constructor).handlers[action] = instance[key];
  };
}
