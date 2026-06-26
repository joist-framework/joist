import { Injector } from "./injector.js";
import { callLifecycle } from "./lifecycle.js";
import { readInjector, readMetadata } from "./metadata.js";
import {
  StaticToken,
  type InjectionToken,
  type Provider,
  type ProviderDef,
  type ProviderFactory,
} from "./provider.js";
import { INJECTOR, SENTINAL } from "./symbols.js";

/**
 * Different types of items have different priorities.
 * For example, if you provide a static token with a default
 * factory alongside a custom factory in a `providers` section,
 * it is expected that the custom factory will override the default
 * by priority.
 */
enum InjectorCacheEntryPriority {
  /** Raw instance with no provider */
  VALUE,
  /** Manually assigned providers */
  PROVIDED,
  /** Static Token's factory provider */
  STATIC_TOKEN,
  /** Constructable Token's new() provider */
  CONSTRUCTABLE,
}

type InjectorCacheEntryParams<T> = {
  priority: InjectorCacheEntryPriority;
  token: InjectionToken<T>;
  injector: Injector;
  factory?: ProviderFactory<T> | undefined;
  instance?: T | undefined;
};

export enum EntryFilter {
  PROVIDERS = 0b0001,
  INSTANCES = 0b0010,
  NOT_PROVIDERS = 0b0100,
  NOT_INSTANCES = 0b1000,
  PROVIDERS_OR_INSTANCES = INSTANCES | PROVIDERS,
  PROVIDERS_NOT_INSTANCES = PROVIDERS | NOT_INSTANCES,
  INSTANCES_NOT_PROVIDERS = INSTANCES | NOT_PROVIDERS,
}

/**
 * Stores a cached entry. an entry may have a factory, an instance, or both.
 *
 * Example of instance without factories:
 *     Injector cannot have a factory, since the goal is to pull from the
 *     highest parent before attempting to pull from a provider
 *
 * Example of provider without instance: uninstantiated providers
 *
 * @throws When instance and factory are both be undefined.
 */
export class InjectorCacheEntry<T> {
  get factory() {
    return this.#_factory;
  }
  get priority() {
    return this.#_priority;
  }
  get instance() {
    return this.#_instance;
  }
  [INJECTOR]: Injector;
  #_instance?: T | undefined;
  #_priority: InjectorCacheEntryPriority;
  #_factory?: ProviderFactory<T> | undefined;
  #token: InjectionToken<T>;

  constructor(params: InjectorCacheEntryParams<T>) {
    this.#token = params.token;
    this.#_instance = params.instance;
    this.#_priority = params.priority;
    this.#_factory = params.factory;
    this[INJECTOR] = params.injector;
  }

  /** Clears the cached value */
  clear() {
    this.#_instance = undefined;
  }

  /**
   * Returns a cached entry or creates it if it doesn't exist
   * @throws when factory is undefined but singleton is true
   */
  getOrInstantiate(opts?: { singleton?: boolean | undefined }): T {
    if (this.#_instance === undefined || opts?.singleton === false) {
      if (this.#_factory === undefined) {
        throw new Error(`Provider not found for "${this.#token.name}"`);
      }
      if (opts?.singleton !== false) {
        this.#_instance = this.#instantiate(this.#_factory, this.#token, opts);
      } else {
        return this.#_factory(this[INJECTOR]);
      }
    }
    return this.#_instance;
  }

  #instantiate(
    factory: ProviderFactory<T>,
    token: InjectionToken<T>,
    opts?: { singleton?: boolean | undefined },
  ): T {
    const instance = factory(this[INJECTOR]);

    /**
     * Only values that are objects are able to have associated injectors
     */
    const injector = readInjector(instance);

    if (!injector) {
      return instance;
    }

    if (injector !== this[INJECTOR]) {
      /**
       * set the this injector instance as a parent.
       * This should ONLY happen in the injector is not self. This would cause an infinite loop.
       * this means that each calling injector will be the parent of what it creates.
       * this allows the created service to navigate up it's chain to find a root
       */
      injector.parent = this[INJECTOR];
    }

    /**
     * the onInit lifecycle hook should be called after the parent is defined.
     * this ensures that services are initialized when the chain is settled
     * this is required since the parent is set after the instance is constructed
     */
    const metadata = readMetadata<T>(token);

    if (metadata) {
      callLifecycle(instance ?? this[INJECTOR], injector, metadata.onCreated);
    }

    return instance;
  }
}

/**
 * Stores multiple {@link InjectorCacheEntry}s.
 */
export class InjectorCacheRow<T> {
  #caches = Array.from(
    Object.values(InjectorCacheEntryPriority)
      .filter((a) => typeof a === "number")
      .map(() => new Array<InjectorCacheEntry<T>>()),
  );
  #token: InjectionToken<T>;
  [INJECTOR]: Injector;

  constructor(injector: Injector, token: InjectionToken<T>) {
    this.#token = token;
    this[INJECTOR] = injector;
  }

  /**
   * Adds an entry to the cache row.
   * @returns the entry added
   */
  add(
    priority: InjectorCacheEntryPriority,
    factory?: ProviderFactory<T> | undefined,
    instance?: T | undefined,
  ): InjectorCacheEntry<T> {
    const entry = new InjectorCacheEntry({
      injector: this[INJECTOR],
      token: this.#token,
      factory,
      instance,
      priority,
    });
    // Optimization: cache entries without instances or factories are unreachable
    // so silently skip adding it in the first place. Might be better to throw
    // instead but that changes the public interface slightly.
    if (instance !== undefined || factory !== undefined) {
      // ! is safe because #cache is guaranteed to have entries for all of InjectorCacheEntryPriority
      this.#caches[priority]!.push(entry);
    }
    return entry;
  }

  clear() {
    for (const entry of this) {
      entry.clear();
    }
  }

  *[Symbol.iterator](): Generator<InjectorCacheEntry<T>> {
    for (const cache of this.#caches) {
      for (const entry of cache) {
        if (entry.factory !== undefined || entry.instance !== undefined) {
          yield entry;
        }
      }
    }
  }
}

/**
 * This injector cache handles the storage of factories, caching, and instantiation of DI tokens on
 * behalf of an Injector.
 */
export class InjectorCache {
  #tokenCaches = new Map<InjectionToken<any>, InjectorCacheRow<any>>();
  [INJECTOR]: Injector;

  constructor(injector: Injector) {
    this[INJECTOR] = injector;
    const injectorRow = new InjectorCacheRow(injector, Injector);
    injectorRow.add(InjectorCacheEntryPriority.VALUE, undefined, this[INJECTOR]);
    this.#tokenCaches.set(Injector, injectorRow);
  }

  get<T>(token: InjectionToken<T>): InjectorCacheRow<T> | undefined {
    return this.#tokenCaches.get(token);
  }

  /**
   * Adds a token to the cache, returns an array of entries created.
   * If the token has no factory, nothing will be created.
   */
  add<T>(token: InjectionToken<T>): [InjectorCacheEntry<T>];
  /**
   * Adds a value to the cache, returns an array of entries created.
   * For values the entries returned will always be one.
   */
  add<T>(token: InjectionToken<T>, value: T): [InjectorCacheEntry<T>];
  /**
   * Adds a provider to the cache, returns an array of entries created.
   * Two entries will be created if the provider token itself has a factory or constructor
   */
  add<T>(provider: Provider<T>): [InjectorCacheEntry<T>, InjectorCacheEntry<T>];
  /**
   * Adds a token or provider to the cache, returns an array of entries created.
   */
  add<T>(
    tokenOrProvider: Provider<T> | InjectionToken<T>,
    value?: T,
  ): [] | [InjectorCacheEntry<T>] | [InjectorCacheEntry<T>, InjectorCacheEntry<T>];
  add<T>(
    tokenOrProvider: Provider<T> | InjectionToken<T>,
    value?: T,
  ): [] | [InjectorCacheEntry<T>] | [InjectorCacheEntry<T>, InjectorCacheEntry<T>] {
    if (tokenOrProvider instanceof Array) {
      const first = this.addProvider(tokenOrProvider);
      const second = this.addToken(tokenOrProvider[0]);
      return [first, second];
    } else if (value !== undefined) {
      return [this.addInstance(tokenOrProvider, value)];
    } else {
      const ret = this.addToken(tokenOrProvider);
      return ret ? [ret] : [];
    }
  }

  addProvider<T>(provider: Provider<T>): InjectorCacheEntry<T> {
    let row = this.#tokenCaches.get(provider[0]);
    if (row === undefined) {
      row = new InjectorCacheRow(this[INJECTOR], provider[0]);
      this.#tokenCaches.set(provider[0], row);
    }
    return row.add(InjectorCacheEntryPriority.PROVIDED, internalProviderDefToFactory(provider[1]));
  }

  addToken<T>(token: InjectionToken<T>): InjectorCacheEntry<T> {
    let row = this.#tokenCaches.get(token);
    if (row === undefined) {
      row = new InjectorCacheRow(this[INJECTOR], token);
      this.#tokenCaches.set(token, row);
    }
    if (token instanceof StaticToken) {
      return row.add(InjectorCacheEntryPriority.STATIC_TOKEN, token.factory);
    }
    const metadata = readMetadata<T>(token);
    return row.add(InjectorCacheEntryPriority.CONSTRUCTABLE, (i) =>
      metadata ? new token({ sentinel: SENTINAL, injector: i }) : new token(),
    );
  }

  addInstance<T>(token: InjectionToken<T>, value: T): InjectorCacheEntry<T> {
    let row = this.#tokenCaches.get(token);
    if (row === undefined) {
      row = new InjectorCacheRow(this[INJECTOR], token);
      this.#tokenCaches.set(token, row);
    }
    return row.add(InjectorCacheEntryPriority.VALUE, undefined, value);
  }

  /** Clears the whole cache, effectively returning it to its initial state */
  clear(): void {
    for (const row of this.#tokenCaches) {
      row[1].clear();
    }
    this.#tokenCaches.clear();
  }
}

function internalProviderDefToFactory<T>(provider: ProviderDef<T>): ProviderFactory<T> {
  if ("use" in provider) {
    const useMetadata = readMetadata<T>(provider.use);
    return (i) =>
      useMetadata ? new provider.use({ sentinel: SENTINAL, injector: i }) : new provider.use();
  }
  if ("factory" in provider) {
    return provider.factory;
  }
  if ("value" in provider) {
    return () => provider.value;
  }
  throw new Error(`Provider for Service is missing 'use', 'factory', or 'value'`);
}
