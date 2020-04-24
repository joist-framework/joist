import { ProviderToken, Provider, ClassProviderToken, FactoryProvider } from './provider';
import { getMetadataRef } from './metadata';

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
    const metaData = getMetadataRef(P);

    return metaData ? new P(...metaData.deps.map((dep) => this.get(dep))) : new P();
  }

  private resolve<T>(token: ProviderToken<T>): T {
    const provider = this.findProvider(token);

    if (provider) {
      return this.createFromProvider(provider);
    }

    const metaData = getMetadataRef(token);

    if (this.parent && (metaData.provideInRoot || this.parent.has(token))) {
      // if a parent is available and contains an instance of the provider already use that
      return this.parent.get(token);
    }

    // if nothing else found assume ClassProviderToken
    return this.create(token as ClassProviderToken<T>);
  }

  private createFromProvider<T>(provider: Provider<T>): T | null {
    if ('useClass' in provider) {
      return this.create(provider.useClass);
    } else if ('useFactory' in provider) {
      return this.createFromFactory(provider as FactoryProvider<T>);
    }

    return null;
  }

  private createFromFactory<T>(token: FactoryProvider<T>) {
    return token.useFactory.apply(
      token,
      token.deps.map((token) => this.get(token))
    );
  }

  private findProvider(token: ProviderToken<any>): Provider<any> | null {
    if (!this.opts.providers) {
      return null;
    }

    return this.opts.providers.find((provider) => provider.provide === token) || null;
  }
}
