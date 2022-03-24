import { CacheableQueryOptions, QueryOptions, QueryRootProvider } from './options';

export function cacheableQuery(
  target: HTMLElement & QueryRootProvider,
  opts: CacheableQueryOptions
) {
  let root = target.shadowRoot || target;

  if (target.queryRoot) {
    root = target.queryRoot();
  }

  if (!opts.cache) {
    return root.querySelector(opts.selector);
  }

  const cached = Reflect.get(target, `__query_cache_${opts.cacheKey}`);

  if (cached) {
    return cached;
  }

  const res = root.querySelector(opts.selector);

  Reflect.set(target, `__query_cache_${opts.cacheKey}`, res);

  return res;
}

export function query(selector: string, { cache }: QueryOptions = { cache: true }) {
  return (target: HTMLElement, key: string) => {
    Object.defineProperty(target, key, {
      get(this: HTMLElement & QueryRootProvider) {
        return cacheableQuery(this, {
          cacheKey: key,
          selector,
          cache,
        });
      },
    });
  };
}
