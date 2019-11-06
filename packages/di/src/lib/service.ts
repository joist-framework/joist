import { ProviderToken } from './provider';

export interface ServiceConfig {
  provideInRoot: boolean;
}

export function Service(serviceConfig: ServiceConfig = { provideInRoot: true }) {
  return function(provider: ProviderToken<any>) {
    provider.provideInRoot = serviceConfig.provideInRoot;
  };
}
