import { ProviderToken } from '@lit-kit/di';

import { getComponentMetadataRef } from './metadata';

export function Handle(action: string) {
  return function (instance: { constructor: ProviderToken<any>; [key: string]: any }, key: string) {
    getComponentMetadataRef(instance.constructor).handlers[action] = instance[key];
  };
}
