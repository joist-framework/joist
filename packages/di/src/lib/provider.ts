import type { Injector } from "./injector.js";

export type ProviderFactory<T> = (injector: Injector) => T;

export const STATIC_TOKEN: unique symbol = Symbol("StaticToken");

export function isStaticToken(token: unknown): token is StaticToken<unknown> {
  return !!token && typeof token === "object" && STATIC_TOKEN in token;
}

export class StaticToken<T> {
  static optional<T>(name: string): StaticToken<T | null> {
    return new StaticToken<T | null>(name, () => null);
  }

  #name: string;
  #factory?: ProviderFactory<T> | undefined;

  [Symbol.metadata] = null;
  [STATIC_TOKEN] = true;

  get name(): string {
    return this.#name;
  }

  get factory(): ProviderFactory<T> | undefined {
    return this.#factory;
  }

  constructor(name: string, factory?: ProviderFactory<T>) {
    this.#name = name;
    this.#factory = factory;
  }
}

export interface ConstructableToken<T> {
  new (...args: any[]): T;
}

export type InjectionToken<T> = ConstructableToken<T> | StaticToken<T>;

export type ProviderDef<T> =
  | {
      use: ConstructableToken<T>;
    }
  | {
      factory: ProviderFactory<T>;
    }
  | {
      value: T;
    };

export type Provider<T> = [InjectionToken<T>, ProviderDef<T>];
