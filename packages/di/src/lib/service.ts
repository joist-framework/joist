import { ProviderToken } from './provider';
import { metaDataCache, MetaData } from './metadata';

export interface ServiceConfig {
  provideInRoot: boolean;
}

export function Service(serviceConfig: ServiceConfig = { provideInRoot: true }) {
  return function(provider: ProviderToken<any>) {
    if (!metaDataCache.has(provider)) {
      metaDataCache.set(provider, { deps: [], provideInRoot: false });
    }

    const metadata = metaDataCache.get(provider) as MetaData;

    metadata.provideInRoot = serviceConfig.provideInRoot;
  };
}
