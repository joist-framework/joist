import { ProviderToken, OverrideProvider, ClassProviderToken, FactoryProvider } from './provider';
import { metaDataCache, MetaData } from './metadata';

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
  private providerWeakMap = new WeakMap<ProviderToken<any>, any>();

  constructor(private opts: InjectorOptions = {}, private parent?: Injector) {
    if (this.opts.bootstrap) {
      this.opts.bootstrap.forEach(provider => this.get(provider));
    }
  }

  /**
   * recursively check if a singleton instance is available for a provider
   */
  has(token: ProviderToken<any>): boolean {
    if (this.parent) {
      return this.parent.has(token);
    }

    return this.providerWeakMap.has(token);
  }

  resolve<T>(token: ProviderToken<T>): T {
    const provider = this.findProvider(token);
    const metaData = metaDataCache.get(token) || new MetaData();

    if (provider) {
      // if an override is available for this Injector use that
      return this.createFromOverride(provider);
    } else if (this.parent && (this.parent.has(token) || metaData.provideInRoot)) {
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
    if (this.providerWeakMap.has(token)) {
      return this.providerWeakMap.get(token);
    }

    let instance: T = this.resolve(token);

    this.providerWeakMap.set(token, instance);

    return instance;
  }

  create<T>(P: ClassProviderToken<T>): T {
    const metaData = metaDataCache.get(P) || new MetaData();

    return new P(...metaData.deps.map(dep => this.get(dep)));
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
    return token.useFactory.apply(token, token.deps.map(token => this.get(token)));
  }

  private findProvider(token: ProviderToken<any>): OverrideProvider<any> | null {
    if (!this.opts.providers) {
      return null;
    }

    return this.opts.providers.find(provider => provider.provide === token) || null;
  }
}
