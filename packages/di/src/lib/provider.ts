import { Injector } from './injector.js';

// @ts-ignore
export class StaticToken<T> {
  name: string;

  constructor(name: string) {
    this.name = name;
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
