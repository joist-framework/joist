import { ProviderToken, Provider, ClassProviderToken } from './provider';
import { getProviderDeps } from './inject';
import { isProvidedInRoot } from './service';

export interface InjectorOptions {
  providers?: Provider<any>[];
  bootstrap?: ProviderToken<any>[];
}

/**
 * Create an instance of a Dependency injector.
 * Can be used to create a singleton of any class that is property annotated with dependencies.
 *
 * @param opts configuration options for the current instance of Injector
 * @param parent a parent instance of Injector
 */
export class Injector {
  private providerMap = new WeakMap<ProviderToken<any>, any>();

  constructor(private opts: InjectorOptions = {}, private parent?: Injector) {
    if (this.opts.bootstrap) {
      this.opts.bootstrap.forEach((provider) => this.get(provider));
    }
  }

  /**
   * recursively check if a singleton instance is available for a provider
   */
  has(token: ProviderToken<any>): boolean {
    if (this.providerMap.has(token)) {
      return true;
    } else if (this.parent) {
      return this.parent.has(token);
    }

    return false;
  }

  /**
   * fetches a singleton instance of a provider
   */
  get<T>(token: ProviderToken<T>): T {
    if (this.providerMap.has(token)) {
      return this.providerMap.get(token);
    }

    let instance: T = this.resolve(token);

    this.providerMap.set(token, instance);

    return instance;
  }

  create<T>(P: ClassProviderToken<T>): T {
    const deps = getProviderDeps(P);

    return new P(...deps.map((dep) => this.get(dep)));
  }

  private resolve<T>(token: ProviderToken<T>): T {
    // Check to see if provider is defined in current scope
    const provider = this.findProvider(token);

    if (provider) {
      // If provider is defined in current scope use that implementation
      return this.create(provider.use);
    }

    if (this.parent && (isProvidedInRoot(token) || this.parent.has(token))) {
      // if a parent is available and contains an instance of the provider already use that
      return this.parent.get(token);
    }

    // if nothing else found assume ClassProviderToken
    return this.create(token as ClassProviderToken<T>);
  }

  private findProvider(token: ProviderToken<any>): Provider<any> | undefined {
    if (!this.opts.providers) {
      return undefined;
    }

    return this.opts.providers.find((provider) => provider.provide === token);
  }
}
