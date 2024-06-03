import { INJECTABLES } from './injectable.js';
import { InjectionToken, Provider, StaticToken } from './provider.js';

// defines available properties that will be on a class instance that can use the inject function
export type Injectable = object & {
  onInject?(): void;
};

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
  // ke track of instances. One Token can have one instance
  #instances = new WeakMap<InjectionToken<any>, any>();

  parent: Injector | undefined = undefined;

  constructor(
    public providers: Provider<any>[] = [],
    parent?: Injector
  ) {
    this.parent = parent;
  }

  // resolves and retuns and instance of the requested service
  get<T extends Injectable>(token: InjectionToken<T>): T {
    // check for a local instance
    if (this.#instances.has(token)) {
      return this.#instances.get(token)!;
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
    } else if (token instanceof StaticToken) {
      throw new Error(`Provider not found for ${token}`);
    }

    // check for a parent and attempt to get there
    if (this.parent) {
      return this.parent.get(token);
    }

    return this.#createAndCache(token, () => new token());
  }

  setParent(parent: Injector | undefined) {
    this.parent = parent;
  }

  clear() {
    this.#instances = new WeakMap();
  }

  #createAndCache<T extends Injectable>(
    token: InjectionToken<T>,
    factory: (injector: Injector) => T
  ): T {
    const instance = factory(this);

    this.#instances.set(token, instance);

    const injector = INJECTABLES.get(instance);

    if (injector) {
      /**
       * set the this injector instance as a parent.
       * this means that each calling injector will be the parent of what it creates.
       * this allows the created service to navigate up it's chain to find a root
       */
      injector.setParent(this);

      /**
       * the on inject lifecycle hook should be called after the parent is defined.
       * this ensures that services are initialized when the chain is settled
       * this is required since the parent is set after the instance is constructed
       */
      if (instance.onInject) {
        instance.onInject();
      }
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
