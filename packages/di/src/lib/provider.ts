import { Injector } from './injector.js';

export type ProviderToken<T> = {
  providers?: Provider<any>[];

  new (...args: any[]): T;
};

export interface Provider<T> {
  provide: ProviderToken<T>;
  use?: ProviderToken<T>;
  factory?(injector: Injector): T;
}
