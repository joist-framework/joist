import { CacheableQueryOptions, QueryOptions, QueryRootProvider } from './options';

export function cacheableQueryAll(
  target: HTMLElement & QueryRootProvider,
  opts: CacheableQueryOptions
) {
  let root = target.shadowRoot || target;

  if (target.queryRoot) {
    root = target.queryRoot();
  }

  if (!opts.cache) {
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

export function queryAll(target: HTMLElement, key: any): void;
export function queryAll(selector: string, opts?: QueryOptions): (target: any, key: any) => void;
export function queryAll(targetOrSelector: unknown, keyOrOpts: unknown) {
  if (targetOrSelector instanceof HTMLElement) {
    const key = keyOrOpts as string;

    defineCacheableQueryProp(targetOrSelector, key, `[query='${key}']`, true);

    return void 0;
  }

  return (target: any, key: string) => {
    const selector = targetOrSelector as string;
    const opts = (keyOrOpts || { cache: true }) as QueryOptions;

    defineCacheableQueryProp(target, key, selector, opts.cache);
  };
}

function defineCacheableQueryProp(target: any, key: any, selector: string, cache: boolean) {
  Object.defineProperty(target, key, {
    get(this: HTMLElement & QueryRootProvider) {
      return cacheableQueryAll(this, {
        cacheKey: key,
        selector,
        cache,
      });
    },
  });
}
