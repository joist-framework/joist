import { ProviderToken, Provider } from './provider.js';

// defines available properties that will be on a class instance that can use the inject function
export type Injectable = object & {
  injector$$?: Injector;
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
  // ke track of isntances. One Token can have one instance
  #instances = new WeakMap<ProviderToken<any>, any>();

  #parent: Injector | undefined = undefined;

  constructor(public providers: Provider<any>[] = [], parent?: Injector) {
    this.setParent(parent);
  }

  // resolves and retuns and instance of the requested service
  get<T extends Injectable>(token: ProviderToken<T>): T {
    // check for a local instance
    if (this.#instances.has(token)) {
      return this.#instances.get(token)!;
    }

    const provider = this.#findProvider(token);

    // check for a provider definition
    if (provider) {
      return this.#createAndCache<T>(provider.use);
    }

    // check for a parent and attempt to get there
    if (this.#parent) {
      return this.#parent.get(token);
    }

    return this.#createAndCache(token);
  }

  setParent(parent: Injector | undefined) {
    this.#parent = parent;
  }

  clear() {
    this.#instances = new WeakMap();
  }

  #createAndCache<T extends Injectable>(token: ProviderToken<T>): T {
    const instance = new token();

    this.#instances.set(token, instance);

    if (instance.injector$$ instanceof Injector) {
      // set the this injector instance as a parent.
      // this means that each calling injector will be the parent of what it creates.
      // this allows the created service to navigate up it's chain to find a root
      instance.injector$$.setParent(this);

      // the on inject lifecycle hook should be called after the parent is defined.
      // this ensures that services are initialized when the chain is settled
      // this is required since the parent is set after the instance is constructed
      if (instance.onInject) {
        instance.onInject();
      }
    }

    return instance;
  }

  #findProvider(token: ProviderToken<any>): Provider<any> | undefined {
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
