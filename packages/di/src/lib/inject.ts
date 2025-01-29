import { INJECTOR, type Injector } from "./injector.js";
import type { InjectionToken } from "./provider.js";

export type Injected<T> = () => T;

export function inject<This extends object & { [INJECTOR]?: Injector }, T>(
  token: InjectionToken<T>,
): Injected<T> {
  return function (this: This) {
    const injector = this[INJECTOR];

    if (injector === undefined) {
      throw new Error(
        `${this.constructor.name} is either not injectable or a service is being called in the constructor. \n Either add the @injectable() to your class or use the @injected callback method.`,
      );
    }

    return injector.inject(token);
  };
}
