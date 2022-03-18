export interface CacheableQueryOptions {
  cache: boolean;
  cacheKey: string;
  selector: string;
}

export interface QueryOptions {
  cache: boolean;
}

export interface QueryRootProvider {
  queryRoot?(): HTMLElement | ShadowRoot;
}
