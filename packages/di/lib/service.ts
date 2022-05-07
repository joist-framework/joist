import { ProviderToken } from './provider.js';

export function service(provider: ProviderToken<any>): any {
  Object.defineProperty(provider, 'provideInRoot', {
    get() {
      return true;
    },
    enumerable: false,
    configurable: false,
  });

  return provider;
}
