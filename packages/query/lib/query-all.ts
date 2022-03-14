export interface QueryAllOptions {
  cache: boolean;
}

export interface CacheableQueryOptions {
  cache: boolean;
  cacheKey: string;
  selector: string;
}

export function cacheableQueryAll(target: HTMLElement | ShadowRoot, opts: CacheableQueryOptions) {
  if (opts.cacheKey == null) {
    return target.querySelectorAll(opts.selector);
  }

  const cached = Reflect.get(target, `__query_cache_${opts.cacheKey}`);

  if (cached) {
    return cached;
  }

  const res = target.querySelectorAll(opts.selector);

  Reflect.set(target, `__query_cache_${opts.cacheKey}`, res);

  return res;
}

export function queryAll(selector: string, { cache }: QueryAllOptions = { cache: true }) {
  return (target: any, key: string) => {
    Object.defineProperty(target, key, {
      get(this: HTMLElement) {
        return cacheableQueryAll(this.shadowRoot || this, {
          cacheKey: key,
          selector,
          cache,
        });
      },
    });
  };
}
