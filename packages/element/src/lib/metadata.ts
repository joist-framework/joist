(Symbol as any).metadata ??= Symbol('Symbol.metadata');

export interface AttrDef {
  propName: string | symbol;
  attrName: string;
  observe: boolean;
  reflect: boolean;
}

export type ListenerSelector<T> = (el: T) => Element | ShadowRoot | null;

export interface Listener<T> {
  event: string;
  cb: (e: Event) => void;
  selector: ListenerSelector<T>;
}

export class ElementMetadata<T> {
  attrs: AttrDef[] = [];
  listeners: Listener<T>[] = [];
  onReady = new Set<Function>();
}

export class MetadataStore extends WeakMap<object, ElementMetadata<unknown>> {
  read<T>(value: object): ElementMetadata<T> {
    if (!this.has(value)) {
      this.set(value, new ElementMetadata());
    }

    return this.get(value)!;
  }
}

export const metadataStore = new MetadataStore();
