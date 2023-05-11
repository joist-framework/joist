import { ProviderToken, Provider } from './provider.js';

export type Injected<T> = () => T;

export class Injector {
  public instances = new WeakMap<ProviderToken<any>, any>();

  constructor(public providers: Provider<any>[] = [], public parent?: Injector) {}

  has<T>(token: ProviderToken<T>): boolean {
    const hasLocally = this.instances.has(token) || !!this.findProvider(token);

    if (hasLocally) {
      return true;
    }

    return this.parent ? this.parent.has(token) : false;
  }

  get<T>(token: ProviderToken<T>): T {
    // check for a local instance
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    const provider = this.findProvider(token);

    // check for a provider definition
    if (provider) {
      return this.createAndCache(provider.use);
    }

    // check for a parent and attempt to get there
    if (this.parent) {
      if (this.parent.has(token) || token.service) {
        return this.parent.get(token);
      }
    }

    // If nothing else treat as a local class provider
    return this.createAndCache(token as ProviderToken<T>);
  }

  create<T>(P: ProviderToken<T>): T {
    if (!P.inject) {
      return new P();
    }

    return new P(...P.inject.map((dep) => () => this.get(dep)));
  }

  private createAndCache<T>(token: ProviderToken<T>): T {
    const instance = this.create(token);

    this.instances.set(token, instance);

    return instance;
  }

  private findProvider(token: ProviderToken<any>): Provider<any> | undefined {
    if (!this.providers) {
      return undefined;
    }

    return this.providers.find((provider) => provider.provide === token);
  }
}
