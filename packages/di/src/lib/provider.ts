export type ProviderToken<T> = {
  new (...args: any[]): T;
};

export interface Provider<T> {
  provide: ProviderToken<T>;
  use: ProviderToken<T>;
}
