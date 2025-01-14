(Symbol as any).metadata ??= Symbol("Symbol.metadata");

export interface AttrDef {
  propName: string | symbol;
  observe: boolean;
  reflect: boolean;
  getPropValue: () => void;
  setPropValue: () => void;
}

export type ListenerSelector<T> = (el: T) => Element | ShadowRoot | null;

export interface Listener<T> {
  event: string;
  cb: (e: Event) => void;
  selector: ListenerSelector<T>;
}

export class AttrMetadata extends Map<string, AttrDef> {}
export class AttrChangeMetadata extends Map<string, Set<() => void>> {}

export class ElementMetadata<T> {
  attrs: AttrMetadata = new AttrMetadata();
  attrChanges: AttrChangeMetadata = new AttrChangeMetadata();
  listeners: Listener<T>[] = [];
  onReady: Set<() => void> = new Set();
}

export class MetadataStore extends WeakMap<object, ElementMetadata<unknown>> {
  read<T>(value: object): ElementMetadata<T> {
    if (!this.has(value)) {
      this.set(value, new ElementMetadata());
    }

    return this.get(value) as ElementMetadata<unknown>;
  }
}

export const metadataStore: MetadataStore = new MetadataStore();
