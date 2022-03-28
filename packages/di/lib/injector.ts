import { ProviderToken, Provider, ClassProviderToken } from './provider';
import { readProviderDeps } from './utils';
import { isProvidedInRoot } from './utils';

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
      if (provider.use) {
        return this.createAndCache(provider.use);
      } else {
        return this.createAndCache(provider as ClassProviderToken<T>);
      }
    }

    // check for a parent and attempt to get there
    if (this.parent) {
      if (this.parent.has(token) || isProvidedInRoot(token)) {
        return this.parent.get(token);
      }
    }

    // If nothing else treat as a local class provider
    return this.createAndCache(token as ClassProviderToken<T>);
  }

  create<T>(P: ClassProviderToken<T>): T {
    const deps = readProviderDeps(P);

    return new P(...deps.map((dep) => this.get(dep)));
  }

  private createAndCache<T>(token: ClassProviderToken<T>): T {
    const instance = this.create(token);

    this.instances.set(token, instance);

    return instance;
  }

  private findProvider(
    token: ProviderToken<any>
  ): Provider<any> | ClassProviderToken<any> | undefined {
    if (!this.providers) {
      return undefined;
    }

    return this.providers.find((provider) => {
      return provider === token || provider.provide === token;
    });
  }
}
