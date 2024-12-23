import { InjectionToken } from './provider.js';
import { injectables } from './injector.js';

export type Injected<T> = () => T;

export function inject<This extends object, T>(token: InjectionToken<T>): Injected<T> {
  return function (this: This) {
    const injector = injectables.get(this);

    if (injector === undefined) {
      const name = this.constructor.name;

      throw new Error(
        `${name} is either not injectable or a service is being called in the constructor. \n Either add the @injectable() to your class or use the @injected callback method.`
      );
    }

    return injector.inject(token);
  };
}
