import { ProviderToken } from '@lit-kit/di';

import { readMetadata } from './metadata';

export function Handle(action: string) {
  return function(instance: any, key: string) {
    const metadata = readMetadata(instance.constructor as ProviderToken<any>);

    metadata.handlers[action] = instance[key];
  };
}
