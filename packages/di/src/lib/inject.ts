import { ProviderToken } from './provider';
import { metaDataCache, MetaData } from './metadata';

export function Inject(injectable: ProviderToken<any>) {
  return function(provider: ProviderToken<any>, _prop: string, index: number) {
    if (!metaDataCache.has(provider)) {
      metaDataCache.set(provider, { deps: [], provideInRoot: false });
    }

    const metadata = metaDataCache.get(provider) as MetaData;

    if (metadata.deps[index] === undefined) {
      metadata.deps[index] = injectable;
    }
  };
}
