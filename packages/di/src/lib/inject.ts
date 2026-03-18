import type { Injector } from "./injector.js";
import type { InjectOpts } from "./injector.js";
import { readInjector } from "./metadata.js";
import type { InjectionToken } from "./provider.js";

export type Injected<T, Args extends any[] = []> = (...args: Args) => T;

/**
 * Injects a service into an `injectable` class.
 */
export function inject<T, Args extends any[] = any[]>(
  token: InjectionToken<T, Args>,
  opts?: InjectOpts,
): Injected<T, Args> {
  return internalInject((i, ...args: Args) => i.inject(token, args, opts));
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

function internalInject<T extends object, R, Args extends any[] = any[]>(
  cb: (i: Injector, ...args: Args) => R,
) {
  return function (this: T, ...args: Args) {
    const injector = readInjector(this);

    if (injector === null) {
      throw new Error(
        `${this.constructor.name} is either not injectable or a service is being called in the constructor. \n Either add the @injectable() to your class or use the @injected callback method.`,
      );
    }

    return cb(injector, ...args);
  };
}
