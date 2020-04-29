import { ProviderToken } from './provider';
import { getMetadataRef } from './metadata';

export function Inject(injectable: ProviderToken<any>) {
  return function (provider: ProviderToken<any>, _prop: string, index: number) {
    getMetadataRef(provider).deps[index] = injectable;
  };
}
