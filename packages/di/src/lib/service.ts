import { ProviderToken } from './provider';

export function isProvidedInRoot(provider: ProviderToken<any>) {
  return provider.provideInRoot || false;
}

export function service() {
  return function (provider: ProviderToken<any>) {
    provider.provideInRoot = true;
  };
}
