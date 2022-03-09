export interface QueryAllOptions {
  cache: boolean;
}

export function queryAll(selector: string, opts: QueryAllOptions = { cache: true }) {
  return (target: any, key: string) => {
    // console.log(desc);

    const descriptor: PropertyDescriptor = {
      get(this: HTMLElement) {
        const cached = Reflect.get(target, `__query_cache_${key}`);

        if (cached) {
          return cached;
        }

        const res = (this.shadowRoot || this).querySelectorAll(selector);

        Reflect.set(target, `__query_cache_${key}`, res);

        return res;
      },
    };

    if (!opts.cache) {
      descriptor.get = function (this: HTMLElement) {
        return (this.shadowRoot || this).querySelectorAll(selector);
      };
    }

    Object.defineProperty(target, key, descriptor);
  };
}
