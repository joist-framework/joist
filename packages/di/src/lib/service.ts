import { ProviderToken } from './provider';
import { getMetadataRef } from './metadata';

export function Service() {
  return function (provider: ProviderToken<any>) {
    getMetadataRef(provider).provideInRoot = true;
  };
}
