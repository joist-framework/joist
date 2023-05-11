export type ProviderToken<T> = {
  service?: boolean;
  inject?: ProviderToken<any>[];
  providers?: Provider<any>[];

  new (...args: any[]): T;
};

export interface Provider<T> {
  provide: ProviderToken<T>;
  use: ProviderToken<T>;
}
