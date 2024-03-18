(Symbol as any).metadata ??= Symbol('Symbol.metadata');

export class ElementMetadata {
  attrs: string[] = [];
  tagName?: (val: any) => string;
  listeners = new Map<string, (e: Event) => void>();
}

export class MetadataStore extends WeakMap<object, ElementMetadata> {
  read(value: object) {
    if (!this.has(value)) {
      this.set(value, new ElementMetadata());
    }

    return this.get(value)!;
  }
}

export const metadataStore = new MetadataStore();
