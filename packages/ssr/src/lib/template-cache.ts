export class TemplateCache {
  #cache = new Map<string, string>();

  async get(key: string): Promise<string | undefined> {
    return this.#cache.get(key);
  }

  async set(key: string, val: string): Promise<this> {
    this.#cache.set(key, val);

    return this;
  }
}

export class NoopTemplateCache extends TemplateCache {
  async get(_: string): Promise<undefined> {
    return undefined;
  }

  async set(_key: string, _val: string): Promise<this> {
    return this;
  }
}
