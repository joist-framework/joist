import { readInjector } from "./metadata.js";
import type { InjectionToken } from "./provider.js";

export type Injected<T> = () => T;

export function injectAll<This extends object, T>(
  token: InjectionToken<T>,
): Injected<T[]> {
  return function (this: This) {
    const injector = readInjector(this);

    if (injector === null) {
      throw new Error(
        `${this.constructor.name} is either not injectable or a service is being called in the constructor. \n Either add the @injectable() to your class or use the @injected callback method.`,
      );
    }

    return injector.injectAll(token);
  };
}
