import { Injector } from './injector.js';

export class StaticToken<T> {
  #name;
  #factory;

  get name() {
    return this.#name;
  }

  get factory() {
    return this.#factory;
  }

  constructor(name: string, factory?: () => T) {
    this.#name = name;
    this.#factory = factory;
  }
}

export interface ConstructableToken<T> {
  providers?: Provider<any>[];

  new (...args: any[]): T;
}

export type InjectionToken<T> = ConstructableToken<T> | StaticToken<T>;

export interface Provider<T> {
  provide: InjectionToken<T>;
  use?: ConstructableToken<T>;
  factory?(injector: Injector): T;
}
