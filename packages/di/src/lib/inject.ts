import { ProviderToken } from './provider.js';
import { Injected, injectors } from './injector.js';

export function inject<This extends object, T extends object>(
  token: ProviderToken<T>
): Injected<T> {
  return function (this: This) {
    const injector = injectors.get(this);

    if (!injector) {
      throw new Error(`${this} is not injectable`);
    }

    return injector.get(token);
  };
}
