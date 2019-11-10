import { ProviderToken } from '@lit-kit/di';

import { getMetadataRef } from './metadata';

export function Handle(action: string) {
  return function(instance: { constructor: ProviderToken<any>; [key: string]: any }, key: string) {
    const metadata = getMetadataRef(instance.constructor as ProviderToken<any>);

    metadata.handlers[action] = instance[key];
  };
}
