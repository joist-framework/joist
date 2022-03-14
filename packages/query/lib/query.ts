export interface QueryOptions {
  cache: boolean;
}

export interface CacheableQueryOptions {
  cache: boolean;
  cacheKey: string;
  selector: string;
}

export function cacheableQuery(target: HTMLElement | ShadowRoot, opts: CacheableQueryOptions) {
  if (opts.cacheKey == null) {
    return target.querySelector(opts.selector);
  }

  const cached = Reflect.get(target, `__query_cache_${opts.cacheKey}`);

  if (cached) {
    return cached;
  }

  const res = target.querySelector(opts.selector);

  Reflect.set(target, `__query_cache_${opts.cacheKey}`, res);

  return res;
}

export function query(selector: string, { cache }: QueryOptions = { cache: true }) {
  return (target: any, key: string) => {
    Object.defineProperty(target, key, {
      get(this: HTMLElement) {
        return cacheableQuery(this.shadowRoot || this, {
          cacheKey: key,
          selector,
          cache,
        });
      },
    });
  };
}
