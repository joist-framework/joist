import { SENTINAL } from "./symbols.js";
import { callLifecycle } from "./lifecycle.js";
import { readInjector, readMetadata } from "./metadata.js";
import {
  type InjectionToken,
  type Provider,
  type ProviderDef,
  type ProviderFactory,
  StaticToken,
} from "./provider.js";
import { ProviderStore } from "./provider-store.js";

export interface InjectorOpts {
  name?: string | undefined;
  providers?: Iterable<Provider<any>> | undefined;
  parent?: Injector | undefined;
}

/**
 * Injectors create and store instances of services.
 * A service is any constructable class.
 * When calling Injector.inject, the injector will resolve as follows:
 *
 * 1. Do I have a cached instance locally?
 * 2. Do I have a local provider definition for the token?
 * 3. Do I have a parent? Check parent recursively for cached instances or providers.
 * 4. All clear, go ahead and construct and cache the requested service.
 * ```
 * RootInjector |--> InjectorA |--> InjectorB
 *                             |--> InjectorC
 *                             |--> InjectorD |--> InjectorE
 * ```
 * In the above tree, if InjectorE requests a service, it will navigate up to the RootInjector and cache.
 * If InjectorB then requests the same token, it will receive the same cached instance from RootInjector.
 *
 * Note: To optimize memory, classes decorated with `@injectable` share their parent injector
 * directly unless they declare local provider overrides or self-provisions.
 */
export class Injector {
  // keep track of instances. Key is InjectionToken or ProviderDef, value is the created instance.
  #instances = new WeakMap<InjectionToken<any> | ProviderDef<any>, any>();

  name?: string | undefined;
  parent?: Injector | undefined;
  providers: ProviderStore;

  constructor(opts?: InjectorOpts) {
    this.name = opts?.name;
    this.parent = opts?.parent;
    this.providers = new ProviderStore(opts?.providers);
    this.providers.set(Injector, { factory: () => this });
  }

  injectAll<T>(
    token: InjectionToken<T>,
    opts?: { ignoreParent?: boolean; singleton?: boolean },
    collection: T[] = [],
  ): T[] {
    const providers = this.providers.get(token);

    if (providers.length > 0) {
      for (const provider of providers) {
        collection.push(
          this.#resolveProvider<T>(token, provider, { singleton: opts?.singleton }),
        );
      }
    } else {
      collection.push(
        this.inject<T>(token, { ignoreParent: true, singleton: opts?.singleton }),
      );
    }

    if (this.parent) {
      return this.parent.injectAll<T>(token, opts, collection);
    }

    return collection;
  }

  create<T>(token: InjectionToken<T>, opts?: { ignoreParent?: boolean }): T {
    return this.inject<T>(token, { ignoreParent: opts?.ignoreParent, singleton: false });
  }

  // resolves and retuns and instance of the requested service
  inject<T>(
    token: InjectionToken<T>,
    opts?: { ignoreParent?: boolean | undefined; singleton?: boolean | undefined },
  ): T {
    const metadata = readMetadata<T>(token);

    if (metadata?.service === false && opts?.singleton !== false) {
      throw new Error(
        `Token ${token.name} is marked as non-service and cannot be injected as a singleton. Please use create.`,
      );
    }

    const providers = this.providers.get(token);
    const provider = providers[0];

    // check for a provider definition
    if (provider) {
      return this.#resolveProvider<T>(token, provider, opts);
    }

    // check for a local instance (when no provider definition is present)
    if (opts?.singleton !== false && this.#instances.has(token)) {
      const instance = this.#instances.get(token);

      const injector = readInjector(instance);

      if (metadata) {
        callLifecycle(instance, injector ?? this, metadata.onInjected);
      }

      return instance;
    }

    // check for a parent and attempt to get there
    if (this.parent && opts?.ignoreParent !== true) {
      return this.parent.inject(token, opts);
    }

    const createOpts = { singleton: opts?.singleton !== false };

    if (token instanceof StaticToken) {
      if (!token.factory) {
        throw new Error(`Provider not found for "${token.name}"`);
      }

      return this.#createAndCache(token, token.factory, createOpts, token);
    }

    return this.#createAndCache(
      token,
      (i) => (metadata ? new token({ sentinel: SENTINAL, injector: i }) : new token()),
      createOpts,
      token,
    );
  }

  clear(): void {
    this.#instances = new WeakMap();
  }

  #resolveProvider<T>(
    token: InjectionToken<T>,
    provider: ProviderDef<T>,
    opts?: { singleton?: boolean | undefined },
  ): T {
    const metadata = readMetadata<T>(token);

    if (opts?.singleton !== false && this.#instances.has(provider)) {
      const instance = this.#instances.get(provider);

      const injector = readInjector(instance);

      if (metadata) {
        callLifecycle(instance, injector ?? this, metadata.onInjected);
      }

      return instance;
    }

    const createOpts = { singleton: opts?.singleton !== false };

    if ("use" in provider) {
      const useMetadata = readMetadata<T>(provider.use);

      return this.#createAndCache<T>(
        provider,
        (i) =>
          useMetadata
            ? new provider.use({ sentinel: SENTINAL, injector: i })
            : new provider.use(),
        createOpts,
        token,
      );
    }

    if ("factory" in provider) {
      return this.#createAndCache<T>(provider, provider.factory, createOpts, token);
    }

    if ("value" in provider) {
      return this.#createAndCache<T>(provider, () => provider.value, createOpts, token);
    }

    throw new Error(
      `Provider for ${token.name} found but is missing either 'use', 'factory', or 'value'`,
    );
  }

  #createAndCache<T>(
    cacheKey: InjectionToken<T> | ProviderDef<T>,
    factory: ProviderFactory<T>,
    opts: { singleton: boolean },
    token: InjectionToken<T>,
  ): T {
    const instance = factory(this);

    if (opts.singleton !== false) {
      this.#instances.set(cacheKey, instance);
    }

    /**
     * Only values that are objects are able to have associated injectors
     */
    const injector = readInjector(instance);

    if (!injector) {
      return instance;
    }

    if (injector !== this) {
      /**
       * set the this injector instance as a parent.
       * This should ONLY happen in the injector is not self. This would cause an infinite loop.
       * this means that each calling injector will be the parent of what it creates.
       * this allows the created service to navigate up it's chain to find a root
       */
      injector.parent = this;
    }

    /**
     * the onInject and onInit lifecycle hook should be called after the parent is defined.
     * this ensures that services are initialized when the chain is settled
     * this is required since the parent is set after the instance is constructed
     */
    const metadata = readMetadata<T>(token);

    if (metadata && typeof instance === "object" && instance !== null) {
      callLifecycle(instance, injector, metadata.onCreated);
      callLifecycle(instance, injector, metadata.onInjected);
    }

    return instance;
  }
}
