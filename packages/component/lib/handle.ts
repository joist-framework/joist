import { ProviderToken } from '@joist/di';

import { getComponentMetadata } from './metadata';

export function Handle(action: string) {
  return function (instance: { constructor: ProviderToken<any>; [key: string]: any }, key: string) {
    getComponentMetadata(instance.constructor).handlers[action] = instance[key];
  };
}
