import { ProviderToken } from './provider';
import { readMetadata } from './metadata';

export interface ServiceConfig {
  provideInRoot: boolean;
}

export function Service(serviceConfig: ServiceConfig = { provideInRoot: true }) {
  return function(provider: ProviderToken<any>) {
    const currentMetadata = readMetadata(provider);

    currentMetadata.provideInRoot = serviceConfig.provideInRoot;
  };
}
