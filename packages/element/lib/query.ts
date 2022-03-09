export interface QueryOptions {
  cache: boolean;
}

export function query(selector: string, opts: QueryOptions = { cache: true }) {
  return (target: any, key: string) => {
    const descriptor: PropertyDescriptor = {
      get(this: HTMLElement) {
        const cached = Reflect.get(target, `__query_cache_${key}`);

        if (cached) {
          return cached;
        }

        const res = (this.shadowRoot || this).querySelector(selector);

        Reflect.set(target, `__query_cache_${key}`, res);

        return res;
      },
    };

    if (!opts.cache) {
      descriptor.get = function (this: HTMLElement) {
        return (this.shadowRoot || this).querySelector(selector);
      };
    }

    Object.defineProperty(target, key, descriptor);
  };
}
