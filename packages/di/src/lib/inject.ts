import { ProviderToken } from './provider.js';
import { Injectable } from './injector.js';
import { INJECTABLES } from './injectable.js';

export type Injected<T> = () => T;

export function inject<This extends Injectable, T extends object>(
  token: ProviderToken<T>
): Injected<T> {
  return function (this: This) {
    const injector = INJECTABLES.get(this);

    if (injector === undefined) {
      const name = Object.getPrototypeOf(this.constructor).name;

      throw new Error(
        `${name} is either not injectable or a service is being called in the constructor. \n Either add the @injectable to your class or use the onInject callback method.`
      );
    }

    return injector.get(token);
  };
}
