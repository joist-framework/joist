import { ProviderToken, Provider } from './provider.js';

export type Injected<T> = () => T;

export const injectors = new WeakMap<object, Injector>();

export class Injector {
  instances = new WeakMap<ProviderToken<any>, any>();
  parent: Injector | undefined = undefined;

  constructor(public providers: Provider<any>[] = [], parent?: Injector) {
    if (parent) {
      this.parent = parent;
    }
  }

  has<T>(token: ProviderToken<T>): boolean {
    const hasLocally = this.instances.has(token) || !!this.findProvider(token);

    if (hasLocally) {
      return true;
    }

    return this.parent ? this.parent.has(token) : false;
  }

  get<T extends object>(token: ProviderToken<T>): T {
    // check for a local instance
    if (this.instances.has(token)) {
      return this.instances.get(token)!;
    }

    const provider = this.findProvider(token);

    // check for a provider definition
    if (provider) {
      const instance = this.createAndCache<T>(provider.use);

      if (injectors.has(instance)) {
        injectors.get(instance)!.setParent(this);
      }

      return instance;
    }

    // check for a parent and attempt to get there
    if (this.parent) {
      if (this.parent.has(token) || token.service) {
        return this.parent.get(token);
      }
    }

    const instance = this.createAndCache(token);

    if (injectors.has(instance)) {
      injectors.get(instance)!.setParent(this);
    }

    return instance;
  }

  setParent(parent: Injector) {
    this.parent = parent;
  }

  private createAndCache<T>(token: ProviderToken<T>): T {
    const instance = new token();

    this.instances.set(token, instance);

    return instance;
  }

  // TODO: optimize for speed
  private findProvider(token: ProviderToken<any>): Provider<any> | undefined {
    if (!this.providers) {
      return undefined;
    }

    return this.providers.find((provider) => provider.provide === token);
  }
}
