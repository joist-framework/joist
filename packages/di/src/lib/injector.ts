import { callLifecycle } from './lifecycle.js';
import { readMetadata } from './metadata.js';
import { InjectionToken, Provider, ProviderDef, ProviderFactory, StaticToken } from './provider.js';

/**
 * Keeps track of all Injectable services and their Injector
 */
export const injectables: WeakMap<object, Injector> = new WeakMap();

export interface InjectorOpts {
  name?: string;
  providers?: Iterable<Provider<any>>;
  parent?: Injector;
}

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
  providers: WeakMap<InjectionToken<any>, ProviderDef<any>>;

  constructor(opts?: InjectorOpts) {
    this.parent = opts?.parent;
    this.providers = new Map(opts?.providers);
  }

  // resolves and retuns and instance of the requested service
  inject<T>(token: InjectionToken<T>): T {
    // check for a local instance
    if (this.#instances.has(token)) {
      const instance = this.#instances.get(token)!;

      const metadata = readMetadata<T>(token);

      if (metadata) {
        callLifecycle(instance, injectables.get(instance) ?? this, metadata.onInjected);
      }

      return instance;
    }

    const provider = this.providers.get(token);

    // check for a provider definition
    if (provider) {
      if ('use' in provider) {
        return this.#createAndCache<T>(token, () => new provider.use());
      } else if ('factory' in provider) {
        return this.#createAndCache<T>(token, provider.factory);
      } else {
        throw new Error(
          `Provider for ${token.name} found but is missing either 'use' or 'factory'`
        );
      }
    }

    // check for a parent and attempt to get there
    if (this.parent) {
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

  setParent(parent: Injector | undefined): void {
    this.parent = parent;
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
    if (typeof instance === 'object' && instance !== null) {
      const injector = injectables.get(instance);

      if (injector && injector !== this) {
        /**
         * set the this injector instance as a parent.
         * This should ONLY happen in the injector is not self. This would cause an infinite loop.
         * this means that each calling injector will be the parent of what it creates.
         * this allows the created service to navigate up it's chain to find a root
         */
        injector.setParent(this);
      }

      /**
       * the onInject and onInit lifecycle hook should be called after the parent is defined.
       * this ensures that services are initialized when the chain is settled
       * this is required since the parent is set after the instance is constructed
       */
      const metadata = readMetadata<T>(token);

      if (metadata) {
        callLifecycle(instance, injector ?? this, metadata.onCreated);
        callLifecycle(instance, injector ?? this, metadata.onInjected);
      }
    }

    return instance;
  }
}
