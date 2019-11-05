import {
  ProviderToken,
  OverrideProvider,
  ClassProviderToken,
  FactoryProvider,
  SymbolToken
} from './provider';

export interface InjectorOptions {
  providers?: OverrideProvider<any>[];
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
  private providerWeakMap = new WeakMap<SymbolToken<any>, any>();
  private providerMap = new Map<string, any>();

  constructor(private opts: InjectorOptions = {}, private parent?: Injector) {
    if (this.opts.bootstrap) {
      this.opts.bootstrap.forEach(provider => this.get(provider));
    }
  }

  /**
   * recursively check if a singleton instance is available for a provider
   */
  has(token: ProviderToken<any>): boolean {
    if (!this.parent) {
      return typeof token === 'string'
        ? this.providerMap.has(token)
        : this.providerWeakMap.has(token);
    } else {
      return this.parent.has(token);
    }
  }

  resolve<T>(token: ProviderToken<T>): T {
    const provider = this.findProvider(token);

    if (provider) {
      // if an override is available for this Injector use that
      return this.createFromOverride(provider);
    }

    if (typeof provider === 'string') {
      throw new Error(`No provider found for ${provider}`);
    }

    const symbolToken = token as SymbolToken<T>;

    if (this.parent && (this.parent.has(symbolToken) || symbolToken.provideInRoot)) {
      // if a parent is available and contains an instance of the provider already use that
      return this.parent.get(token);
    }

    // if nothing else found assume provider is a class provider
    return this.create(<ClassProviderToken<T>>token);
  }

  /**
   * fetches a singleton instance of a provider
   */
  get<T>(token: ProviderToken<T>): T {
    if (typeof token === 'string' && this.providerMap.has(token)) {
      // if provider has already been created in this scope return it
      return this.providerMap.get(token);
    } else if (this.providerWeakMap.has(token as SymbolToken<T>)) {
      return this.providerWeakMap.get(token as SymbolToken<T>);
    }

    let instance: T = this.resolve(token);

    if (typeof token === 'string') {
      this.providerMap.set(token, instance);
    } else {
      this.providerWeakMap.set(token, instance);
    }

    return instance;
  }

  create<T>(P: ClassProviderToken<T>): T {
    return P.deps ? new P(...P.deps.map(dep => this.get(dep))) : new P();
  }

  private createFromOverride<T>(provider: OverrideProvider<T>): T | null {
    if ('useClass' in provider) {
      return this.create(provider.useClass);
    } else if ('useFactory' in provider) {
      return this.createFromFactory(provider as FactoryProvider<T>);
    }

    return null;
  }

  private createFromFactory<T>(token: FactoryProvider<T>) {
    const deps = token.deps ? token.deps.map(dep => this.get(dep)) : [];

    return token.useFactory.apply(token, deps);
  }

  private findProvider(token: ProviderToken<any>): OverrideProvider<any> | null {
    if (!this.opts.providers) {
      return null;
    }

    return this.opts.providers.find(provider => provider.provide === token) || null;
  }
}
