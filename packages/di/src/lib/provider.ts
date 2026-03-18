import type { Injector } from "./injector.js";

export type ProviderFactory<T, Args extends any[] = any[]> = (
  injector: Injector,
  ...args: Args
) => T;

export class StaticToken<T, Args extends any[] = []> {
  #name: string;
  #factory?: ProviderFactory<T, Args>;

  [Symbol.metadata] = null;

  get name(): string {
    return this.#name;
  }

  get factory(): ProviderFactory<T, Args> | undefined {
    return this.#factory;
  }

  constructor(name: string, factory?: ProviderFactory<T, Args>) {
    this.#name = name;
    this.#factory = factory;
  }
}

export interface ConstructableToken<T, Args extends any[] = any[]> {
  new (...args: Args): T;
}

export type InjectionToken<T, Args extends any[] = any[]> =
  | ConstructableToken<T, Args>
  | StaticToken<T, Args>;

export type ProviderDef<T, Args extends any[] = any[]> =
  | {
      use: ConstructableToken<T, Args>;
    }
  | {
      factory: ProviderFactory<T, Args>;
    };

export type Provider<T, Args extends any[] = any[]> = [
  InjectionToken<T, Args>,
  ProviderDef<T, Args>,
];
