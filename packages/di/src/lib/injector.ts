import { ProviderToken, Provider } from './provider.js';

export type Injected<T> = () => T;

export type Injectable = object & {
  injector$$?: Injector;
  onInject?(): void;
};

// Track which dependencies are services.
export const rootServices = new WeakSet<ProviderToken<any>>();

export class Injector {
  #instances = new WeakMap<ProviderToken<any>, any>();
  #parent: Injector | undefined = undefined;

  constructor(public providers: Provider<any>[] = [], parent?: Injector) {
    if (parent) {
      this.#parent = parent;
    }
  }

  has<T>(token: ProviderToken<T>): boolean {
    const hasLocally = this.#instances.has(token) || !!this.#findProvider(token);

    if (hasLocally) {
      return true;
    }

    return this.#parent ? this.#parent.has(token) : false;
  }

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
      if (this.#parent.has(token) || rootServices.has(token)) {
        return this.#parent.get(token);
      }
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

    if (instance.injector$$) {
      // set the this injector instance as a parent.
      // this means that each calling injector will be the parent of what it creates.
      // this allows the created service to navigate up it's chain to find a root
      instance.injector$$.setParent(this);

      // the on inject lifecycle hook should be called after the parent is defined.
      // this ensures that services are initialized when the chain is settled
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
