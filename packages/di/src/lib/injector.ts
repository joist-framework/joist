import { callLifecycle } from "./lifecycle.js";
import { readInjector, readMetadata } from "./metadata.js";
import {
  type InjectionToken,
  type Provider,
  type ProviderDef,
  type ProviderFactory,
  StaticToken,
} from "./provider.js";

export interface InjectorOpts {
  name?: string;
  providers?: Iterable<Provider<any>>;
  parent?: Injector;
}

export const INJECTOR: unique symbol = Symbol("JOIST_INJECTOR");

export class ProviderMap extends Map<InjectionToken<any>, ProviderDef<any>> {}

/**
 * Injectors create and store instances of services.
 * A service is any constructable class.
 * When calling Injector.get, the injector will resolve as following.
 *
 * 1. Do I have a cached instance locally?
 * 2. Do I have a local provider definition for the token?
 * 3. Do I have a parent? Check parent for 1 and 2
 * 5. All clear, go ahead and construct and cache the requested service
 *
 * RootInjector |--> InjectorA |--> InjectorB
 *                             |--> InjectorC
 *                             |--> InjectorD |--> InjectorE
 *
 * in the above tree, if InjectorE requests a service, it will navigate up to the RootInjector and cache.
 * If Inject B then requests the same token, it will recieve the same cached instance from RootInjector.
 */
export class Injector {
  // keep track of instances. One Token can have one instance
  #instances = new WeakMap<InjectionToken<any>, any>();

  name?: string;
  parent?: Injector;
  providers: ProviderMap;

  constructor(opts?: InjectorOpts) {
    this.parent = opts?.parent;
    this.providers = new ProviderMap(opts?.providers);
  }

  injectAll<T>(token: InjectionToken<T>, collection: T[] = []): T[] {
    const result: T[] = [
      ...collection,
      this.inject<T>(token, { skipParent: true }),
    ];

    if (this.parent) {
      return this.parent.injectAll<T>(token, result);
    }

    return result;
  }

  // resolves and retuns and instance of the requested service
  inject<T>(token: InjectionToken<T>, opts?: { skipParent: boolean }): T {
    // check for a local instance
    if (this.#instances.has(token)) {
      const instance = this.#instances.get(token);

      const metadata = readMetadata<T>(token);
      const injector = readInjector(instance);

      if (metadata) {
        callLifecycle(instance, injector ?? this, metadata.onInjected);
      }

      return instance;
    }

    const provider = this.providers.get(token);

    // check for a provider definition
    if (provider) {
      if ("use" in provider) {
        return this.#createAndCache<T>(token, () => new provider.use());
      }

      if ("factory" in provider) {
        return this.#createAndCache<T>(token, provider.factory);
      }

      throw new Error(
        `Provider for ${token.name} found but is missing either 'use' or 'factory'`,
      );
    }

    // check for a parent and attempt to get there
    if (this.parent && !opts?.skipParent) {
      return this.parent.inject(token);
    }

    if (token instanceof StaticToken) {
      if (!token.factory) {
        throw new Error(`Provider not found for "${token.name}"`);
      }

      return this.#createAndCache(token, token.factory);
    }

    return this.#createAndCache(token, () => new token());
  }

  clear(): void {
    this.#instances = new WeakMap();
  }

  #createAndCache<T>(token: InjectionToken<T>, factory: ProviderFactory<T>): T {
    const instance = factory(this);

    this.#instances.set(token, instance);

    /**
     * Only values that are objects are able to have associated injectors
     */
    const injector = readInjector(instance);

    if (injector) {
      if (injector !== this) {
        /**
         * set the this injector instance as a parent.
         * This should ONLY happen in the injector is not self. This would cause an infinite loop.
         * this means that each calling injector will be the parent of what it creates.
         * this allows the created service to navigate up it's chain to find a root
         */
        injector.parent = this;
      }

      /**
       * the onInject and onInit lifecycle hook should be called after the parent is defined.
       * this ensures that services are initialized when the chain is settled
       * this is required since the parent is set after the instance is constructed
       */
      const metadata = readMetadata<T>(token);

      if (metadata) {
        callLifecycle(instance ?? this, injector, metadata.onCreated);
        callLifecycle(instance ?? this, injector, metadata.onInjected);
      }
    }

    return instance;
  }
}
