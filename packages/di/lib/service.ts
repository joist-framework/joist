import { ProviderToken } from '../lib/provider';

export function service() {
  return function (provider: ProviderToken<any>) {
    Object.defineProperty(provider, 'provideInRoot', { value: true });
  };
}
