import { ProviderToken } from './provider';

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
