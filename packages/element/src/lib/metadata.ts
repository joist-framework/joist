(Symbol as any).metadata ??= Symbol('Symbol.metadata');

export abstract class MetadataStore<T> {
  #data = new WeakMap<object, T>();

  read<T extends object>(value: T) {
    if (!this.#data.has(value)) {
      this.#data.set(value, this.init());
    }

    return this.#data.get(value)!;
  }

  abstract init(): T;
}

export class ElementMetadata {
  attrs: string[] = [];
  tagName?: (val: any) => string;
}

export class ElementMetadataStore extends MetadataStore<ElementMetadata> {
  init() {
    return new ElementMetadata();
  }
}

export const metadataStore = new ElementMetadataStore();
