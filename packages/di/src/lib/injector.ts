import { INJECTABLE_MAP } from './injectable.js';
import { LifeCycle } from './lifecycle.js';
import { InjectionToken, Provider, StaticToken } from './provider.js';

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

  parent;
  providers;

  constructor(providers: Provider<unknown>[] = [], parent?: Injector) {
    this.parent = parent;
    this.providers = providers;
  }

  inject<T>(token: InjectionToken<T>): T {
    return this.get(token);
  }

  // resolves and retuns and instance of the requested service
  get<T>(token: InjectionToken<T>): T {
    // check for a local instance
    if (this.#instances.has(token)) {
      const instance = this.#instances.get(token)!;

      callLifecycle(instance, LifeCycle.onInject);

      return instance;
    }

    const provider = this.#findProvider(token);

    // check for a provider definition
    if (provider) {
      if (provider.use) {
        const use = provider.use;

        return this.#createAndCache<T>(token, () => new use());
      } else if (provider.factory) {
        const factory = provider.factory;

        return this.#createAndCache<T>(token, factory);
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
        throw new Error(`Provider not found for ${token}`);
      }

      return this.#createAndCache(token, token.factory);
    }

    return this.#createAndCache(token, () => new token());
  }

  setParent(parent: Injector | undefined) {
    this.parent = parent;
  }

  clear() {
    this.#instances = new WeakMap();
  }

  #createAndCache<T>(token: InjectionToken<T>, factory: (injector: Injector) => T): T {
    const instance = factory(this);

    this.#instances.set(token, instance);

    /**
     * Only values that are objects are able to have associated injectors
     */
    if (typeof instance === 'object' && instance !== null) {
      const injector = INJECTABLE_MAP.get(instance);

      if (injector) {
        /**
         * set the this injector instance as a parent.
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
      callLifecycle(instance, LifeCycle.onInit);
      callLifecycle(instance, LifeCycle.onInject);
    }

    return instance;
  }

  #findProvider(token: InjectionToken<any>): Provider<any> | undefined {
    if (!this.providers) {
      return undefined;
    }

    for (let i = 0; i < this.providers.length; i++) {
      if (this.providers[i].provide === token) {
        return this.providers[i];
      }
    }

    return undefined;
  }
}

export function injector(providers: Provider<unknown>[] = [], parent?: Injector) {
  return new Injector(providers, parent);
}
function callLifecycle(instance: unknown, method: symbol) {
  if (typeof instance === 'object' && instance !== null) {
    const lifecycle = Reflect.get(instance, method);

    if (typeof lifecycle === 'function') {
      lifecycle.call(instance);
    }
  }
}
