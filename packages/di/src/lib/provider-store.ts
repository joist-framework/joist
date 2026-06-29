import type { InjectionToken, Provider, ProviderDef } from "./provider.js";

export class ProviderStore {
  #providers: Map<InjectionToken<any>, ProviderDef<any>[]> = new Map();

  constructor(entries?: Iterable<Provider<any>> | undefined | null) {
    if (entries) {
      for (const [key, value] of entries) {
        this.append(key, value);
      }
    }
  }

  set(key: InjectionToken<any>, value: ProviderDef<any>): this {
    this.#providers.set(key, [value]);

    return this;
  }

  append(key: InjectionToken<any>, value: ProviderDef<any>): this {
    const providers = this.get(key);
    providers.push(value);

    return this;
  }

  get(key: InjectionToken<any>): ProviderDef<any>[] {
    let providers = this.#providers.get(key);

    if (!providers) {
      providers = [];
      this.#providers.set(key, providers);
    }

    return providers;
  }
}
