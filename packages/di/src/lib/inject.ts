import { ProviderToken } from './provider';
import { readMetadata } from './metadata';

export function Inject(injectable: ProviderToken<any>) {
  return function(provider: ProviderToken<any>, _prop: string, index: number) {
    const currentMetadata = readMetadata(provider);

    currentMetadata.deps[index] = injectable;
  };
}
