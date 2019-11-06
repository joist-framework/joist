export type ClassProviderToken<T> = {
  deps?: ProviderToken<any>[];
  provideInRoot?: boolean;

  new (...args: any[]): T;
};

export type AbstractClassProviderToken<T> = Function & {
  prototype: T;
  deps?: ProviderToken<any>[];
  provideInRoot?: boolean;
};

export type ProviderToken<T> = ClassProviderToken<T> | AbstractClassProviderToken<T>;

export interface ClassProvider<T> {
  provide: ProviderToken<T>;
  useClass: ClassProviderToken<T>;
  provideInRoot?: boolean;
}

export interface FactoryProvider<T> {
  provide: ProviderToken<T>;
  useFactory: (...args: any[]) => T;
  deps?: ProviderToken<any>[];
  provideInRoot?: boolean;
}

export type OverrideProvider<T> = ClassProvider<T> | FactoryProvider<T>;
