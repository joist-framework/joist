import { SymbolToken } from './provider';

export interface ServiceConfig {
  provideInRoot: boolean;
}

export function RootService(serviceConfig: ServiceConfig = { provideInRoot: true }) {
  return function(provider: SymbolToken<any>) {
    provider.provideInRoot = serviceConfig.provideInRoot;
  };
}
