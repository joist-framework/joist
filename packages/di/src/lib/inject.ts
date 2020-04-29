import { ProviderToken } from './provider';

export const PROVIDER_DEPS_KEY = 'deps';

export function getProviderDeps(provider: ProviderToken<any>): ProviderToken<any>[] {
  return provider[PROVIDER_DEPS_KEY] || [];
}

export function Inject(injectable: ProviderToken<any>) {
  return function (provider: ProviderToken<any>, _prop: string, index: number) {
    provider[PROVIDER_DEPS_KEY] = provider[PROVIDER_DEPS_KEY] || [];
    provider[PROVIDER_DEPS_KEY][index] = injectable;
  };
}
