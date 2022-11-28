export class TemplateCache {
  #cache = new Map<string, string>();

  async get(key: string) {
    return this.#cache.get(key);
  }

  async set(key: string, val: string) {
    this.#cache.set(key, val);

    return this;
  }
}

export class NoopTemplateCache extends TemplateCache {
  async get(_: string) {
    return undefined;
  }

  async set(_key: string, _val: string) {
    return this;
  }
}
