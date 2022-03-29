export type ClassProviderToken<T> = {
  [key: string]: any;
  new (...args: any[]): T;
};

export type AbstractClassProviderToken<T> = Function & { prototype: T; [key: string]: any };

export type ProviderToken<T> = ClassProviderToken<T> | AbstractClassProviderToken<T>;

export interface ProviderDef<T> {
  provide: ProviderToken<T>;
  use: ClassProviderToken<T>;
}

export type Provider<T> = ProviderDef<T> | ClassProviderToken<T>;
