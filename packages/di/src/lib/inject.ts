import { InjectionToken } from './provider.js';
import { Injectables } from './injector.js';

export type Injected<T> = () => T;

export function inject<This extends object, T>(token: InjectionToken<T>): Injected<T> {
  return function (this: This) {
    const injector = Injectables.get(this);

    if (injector === undefined) {
      const name = Object.getPrototypeOf(this.constructor).name;

      throw new Error(
        `${name} is either not injectable or a service is being called in the constructor. \n Either add the @injectable to your class or use the [LifeCycle.onInject] callback method.`
      );
    }

    return injector.inject(token);
  };
}
