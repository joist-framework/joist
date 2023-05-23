import { ProviderToken } from './provider.js';
import { Injected, injectors } from './injector.js';

export function inject<This extends object, T extends object>(
  token: ProviderToken<T>
): Injected<T> {
  return function (this: This) {
    const injector = injectors.get(this);

    if (!injector) {
      const name = Object.getPrototypeOf(this.constructor).name;

      throw new Error(
        `${name} is either not injectable or a service is being called in the constructor. \n Either add the @injectable to your class or use the onInject callback method.`
      );
    }

    return injector.get(token);
  };
}
