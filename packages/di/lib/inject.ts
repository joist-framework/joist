import { ProviderToken } from '../lib/provider';
import { PROVIDER_DEPS_KEY } from '../lib/utils';

export function inject(injectable: ProviderToken<any>) {
  return function (target: any, _: string, index: number) {
    target[PROVIDER_DEPS_KEY] = target[PROVIDER_DEPS_KEY] || [];
    target[PROVIDER_DEPS_KEY][index] = injectable;
  };
}
