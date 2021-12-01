import { ProviderToken } from '../lib/provider';

export function service(provider: ProviderToken<any>): any {
  Object.defineProperty(provider, 'provideInRoot', { value: true });

  return provider;
}
