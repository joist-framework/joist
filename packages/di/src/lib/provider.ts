import { Injector } from './injector.js';

export type ProviderFactory<T> = (injector: Injector) => T;

export class StaticToken<T> {
  #name;
  #factory;

  get name() {
    return this.#name;
  }

  get factory() {
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

export interface Provider<T> {
  provide: InjectionToken<T>;
  use?: ConstructableToken<T>;
  factory?: ProviderFactory<T>;
}
