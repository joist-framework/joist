export type ClassProviderToken<T> = {
  new (...args: any[]): T;
};

export type AbstractClassProviderToken<T> = Function & { prototype: T };

export type ProviderToken<T> = ClassProviderToken<T> | AbstractClassProviderToken<T>;

export interface ClassProvider<T> {
  provide: ProviderToken<T>;
  useClass: ClassProviderToken<T>;
}

export interface FactoryProvider<T> {
  provide: ProviderToken<T>;
  useFactory: (...args: any[]) => T;
  deps: ProviderToken<any>[];
}

export type Provider<T> = ClassProvider<T> | FactoryProvider<T>;
