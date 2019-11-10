import { ProviderToken } from './provider';
import { getMetadataRef } from './metadata';

export interface ServiceConfig {
  provideInRoot: boolean;
}

export function Service(serviceConfig: ServiceConfig = { provideInRoot: true }) {
  return function(provider: ProviderToken<any>) {
    const currentMetadata = getMetadataRef(provider);

    currentMetadata.provideInRoot = serviceConfig.provideInRoot;
  };
}
