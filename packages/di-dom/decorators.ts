import { ProviderToken } from '@joist/di';

import { InjectorBase } from './lib/injector';

/**
 * Takes an InjectionToken and resolves that token to a service
 */
export function get<T>(token: ProviderToken<T>) {
  return function (target: InjectorBase, key: string) {
    Object.defineProperty(target, key, {
      get(this: InjectorBase) {
        return this.injector.get(token);
      },
    });
  };
}
