import { ProviderToken } from './provider';

export const PROVIDER_DEPS_KEY = 'deps';

export function readProviderDeps(provider: ProviderToken<any>): ProviderToken<any>[] {
  return provider[PROVIDER_DEPS_KEY] || provider.prototype[PROVIDER_DEPS_KEY] || [];
}

export function isProvidedInRoot(provider: ProviderToken<any>) {
  return provider.provideInRoot || false;
}
