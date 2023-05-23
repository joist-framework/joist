import { ProviderToken } from './provider.js';
import { Injected, injectors } from './injector.js';

export type Inject = <T extends object>(token: ProviderToken<T>) => Injected<T>;

export function inject<This extends object, T extends object>(
  token: ProviderToken<T>
): Injected<T> {
  return function (this: This) {
    if (typeof this === 'undefined') {
      throw new Error(
        `injected service called in constructor. \n to access injected values in the constructor use the passed in "inject" function`
      );
    }

    const injector = injectors.get(this);

    if (!injector) {
      throw new Error(`${this} is not injectable`);
    }

    return injector.get(token);
  };
}
