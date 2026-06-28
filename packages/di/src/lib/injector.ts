import { callLifecycle } from "./lifecycle.js";
import { readMetadata } from "./metadata.js";
import type { InjectionToken, Provider } from "./provider.js";
import { EntryFilter, InjectorCache, InjectorCacheEntry } from "./injector-cache.js";

export interface InjectorOpts {
  name?: string | undefined;
  providers?: Iterable<Provider<any>> | undefined;
  parent?: Injector | undefined;
}

/**
 * Injectors create and store instances of services.
 * A service is any constructable class.
 * When calling Injector.inject, the injector will resolve as follows:
 *
 * 1. Do I have a cached instance locally?
 * 2. Do I have a local provider definition for the token?
 * 3. Do I have a parent? Check parent recursively for cached instances or providers.
 * 4. All clear, go ahead and construct and cache the requested service.
 * ```
 * RootInjector |--> InjectorA |--> InjectorB
 *                             |--> InjectorC
 *                             |--> InjectorD |--> InjectorE
 * ```
 * In the above tree, if InjectorE requests a service, it will navigate up to the RootInjector and cache.
 * If InjectorB then requests the same token, it will receive the same cached instance from RootInjector.
 *
 * Note: To optimize memory, classes decorated with `@injectable` share their parent injector
 * directly unless they declare local provider overrides or self-provisions.
 */
export class Injector {
  // keep track of instances. One Token can have one instance
  protected _cache = new InjectorCache(this);

  name?: string | undefined;
  parent?: Injector | undefined;

  constructor(opts?: InjectorOpts) {
    this.name = opts?.name;
    this.parent = opts?.parent;
    for (const provider of opts?.providers ?? []) {
      this._cache.add(provider);
    }
  }

  injectAll<T>(
    token: InjectionToken<T>,
    opts?: {
      ignoreParent?: boolean | undefined;
      ignoreSelf?: boolean | undefined;
      singleton?: boolean | undefined;
    },
  ): T[] {
    const metadata = readMetadata<T>(token);

    if (metadata?.service === false && opts?.singleton !== false) {
      throw new Error(
        `Token ${token.name} is marked as non-service and cannot be injected as a singleton. Please use create.`,
      );
    }

    const ret: T[] = [];

    // Check for providers or instantiated instances
    const providerIter = this.#iter(token, opts);
    let next = providerIter.next();
    while (!next.done) {
      ret.push(next.value.getOrInstantiate(opts));
      next = providerIter.next();
    }

    if (metadata) {
      for (const instance of ret) {
        callLifecycle(instance ?? this, this, metadata.onInjected);
      }
    }
    return ret;
  }

  create<T>(token: InjectionToken<T>, opts?: { ignoreParent?: boolean }): T {
    return this.inject<T>(token, { ignoreParent: opts?.ignoreParent, singleton: false });
  }

  // resolves and returns and instance of the requested service
  inject<T>(
    token: InjectionToken<T>,
    opts?: {
      ignoreParent?: boolean | undefined;
      ignoreSelf?: boolean | undefined;
      singleton?: boolean | undefined;
    },
  ): T {
    const metadata = readMetadata<T>(token);

    if (metadata?.service === false && opts?.singleton !== false) {
      throw new Error(
        `Token ${token.name} is marked as non-service and cannot be injected as a singleton. Please use create.`,
      );
    }

    let instance: T;
    // Check for providers or instantiated instances
    const firstInstanceOrProvider = this.#iter(token, opts).next();
    if (!firstInstanceOrProvider.done) {
      instance = firstInstanceOrProvider.value.getOrInstantiate(opts);
    } else {
      // Otherwise add to top of tree
      instance = firstInstanceOrProvider.value._cache.addToken(token).getOrInstantiate(opts);
    }

    if (metadata) {
      callLifecycle(instance ?? this, this, metadata.onInjected);
    }
    return instance;
  }

  clear(): void {
    this._cache.clear();
  }

  /**
   * Adds a token to the injector
   */
  add<T>(token: InjectionToken<T>): void;
  /**
   * Adds a value to the injector
   */
  add<T>(token: InjectionToken<T>, value: T): void;
  /**
   * Adds a provider to the injector
   */
  add<T>(provider: Provider<T>): void;
  /**
   * Adds a token or provider to the injector
   */
  add<T>(tokenOrProvider: Provider<T> | InjectionToken<T>, value?: T): void {
    this._cache.add(tokenOrProvider, value);
  }

  /**
   *
   * @param token Injection token to iterate through
   * @param opts.ignoreParent Skip checking any parents
   * @param opts.ignoreSelf Skip checking self
   * @yields {@link InjectorCacheEntry<T>} while iterating
   * @returns `{done: true, value: Injector}` where `value` is the last {@link injector} visited when done iterating
   */
  *#iter<T>(
    token: InjectionToken<T>,
    opts?: { ignoreParent?: boolean | undefined; ignoreSelf?: boolean | undefined },
  ): Generator<InjectorCacheEntry<T>, Injector> {
    const providerTreeIter = iterInjectorTree(this, opts);
    let next = providerTreeIter.next();
    while (next.done !== true) {
      const row = next.value._cache.get(token);
      if (row !== undefined) {
        for (const provider of row) {
          yield provider;
        }
      }
      next = providerTreeIter.next();
    }
    return next.value;
  }
}

function* iterInjectorTree(
  injector: Injector,
  opts?: { ignoreParent?: boolean | undefined; ignoreSelf?: boolean | undefined },
) {
  // Ignore self + parent = ignore all, immediately return
  if (opts?.ignoreSelf === true && opts.ignoreParent === true) {
    return injector;
  }
  // if ignore self, skip ahead, if there's no parent, return
  if (opts?.ignoreSelf === true) {
    if (injector.parent == undefined) {
      return injector;
    }
    injector = injector.parent;
  }
  yield injector;
  if (opts?.ignoreParent === true) {
    return injector;
  }
  while (injector.parent !== undefined) {
    injector = injector.parent;
    yield injector;
  }
  // allow last injector to be retrievable after iterating
  return injector;
}
