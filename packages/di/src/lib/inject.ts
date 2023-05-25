import { ProviderToken } from './provider.js';
import { Injectable, Injected } from './injector.js';

export function inject<This extends Injectable, T extends object>(
  token: ProviderToken<T>
): Injected<T> {
  let cache: T | undefined = undefined; // cache closer to the object

  return function (this: This) {
    if (cache) {
      return cache;
    }

    if (this.injector$$ === undefined) {
      const name = Object.getPrototypeOf(this.constructor).name;

      throw new Error(
        `${name} is either not injectable or a service is being called in the constructor. \n Either add the @injectable to your class or use the onInject callback method.`
      );
    }

    cache = this.injector$$.get(token);

    return cache;
  };
}
