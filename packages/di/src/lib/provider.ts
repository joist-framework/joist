import { Injector } from './injector.js';

export class StaticToken<T> {
  name;
  factory;

  constructor(name: string, factory?: () => T) {
    this.name = name;
    this.factory = factory;
  }
}

export function token<T>(name: string, factory?: () => T) {
  return new StaticToken(name, factory);
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
