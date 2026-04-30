import type { Injector } from "./injector.js";
import { readInjector } from "./metadata.js";
import type { InjectionToken } from "./provider.js";

export type Injected<T> = () => T;

/**
 * Injects a service into an `injectable` class.
 */
export function inject<T>(
  token: InjectionToken<T>,
  opts?: { ignoreParent?: boolean },
): Injected<T> {
  let instance: T | null = null;
  let parent: Injector | undefined = undefined;

  return internalInject((i) => {
    if (instance === null) {
      instance = i.inject(token, opts);
      parent = i.parent;
    } else if (i.parent !== parent) {
      // If the parent injector has changed, we need to re-inject to get the correct instance.
      instance = i.inject(token, opts);
      parent = i.parent;
    }

    return instance;
  });
}

/**
 * Creates a new instance of a service each time it is called, bypassing the singleton cache.
 * Use this for classes decorated with `@injectable({ service: false })`.
 */
export function create<T>(
  token: InjectionToken<T>,
  opts?: { ignoreParent?: boolean },
): Injected<T> {
  return internalInject((i) => i.create(token, opts));
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
