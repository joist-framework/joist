import type { Injector } from "./injector.js";
import { readInjector } from "./metadata.js";
import type { InjectionToken } from "./provider.js";

export type Injected<T> = () => T;

/**
 * Injects a service into an `injectable` class.
 */
export function inject<T>(token: InjectionToken<T>, opts?: { singleton: boolean }): Injected<T> {
  return internalInject((i) => i.inject(token, opts));
}

/**
 * Finds and injects ALL instances of a service from the current points up.
 */
export function injectAll<T>(
  token: InjectionToken<T>,
  opts?: { singleton: boolean },
): Injected<T[]> {
  return internalInject((i) => i.injectAll(token, opts));
}

function internalInject<T extends object, R>(cb: (i: Injector) => R) {
  return function (this: T) {
    const injector = readInjector(this);

    if (injector === null) {
      throw new Error(
        `${this.constructor.name} is either not injectable or a service is being called in the constructor. \n Either add the @injectable() to your class or use the @injected callback method.`,
      );
    }

    return cb(injector);
  };
}
