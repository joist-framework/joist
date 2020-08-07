import { ProviderToken } from './provider';

export const PROVIDER_DEPS_KEY = 'deps';

export function getProviderDeps(provider: ProviderToken<any>): ProviderToken<any>[] {
  return provider[PROVIDER_DEPS_KEY] || [];
}

export function inject(injectable: ProviderToken<any>) {
  return function (target: any, _: string, index: number) {
    const provider = target.contructor || target;

    provider[PROVIDER_DEPS_KEY] = provider[PROVIDER_DEPS_KEY] || [];
    provider[PROVIDER_DEPS_KEY][index] = injectable;
  };
}
