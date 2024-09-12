(Symbol as any).metadata ??= Symbol('Symbol.metadata');

export interface AttrDef {
  propName: string | symbol;
  attrName: string;
  observe: boolean;
}

export type ListenerSelector = (el: Element) => Element | ShadowRoot | null;

export interface Listener {
  event: string;
  cb: (e: Event) => void;
  selector: ListenerSelector;
}

export class ElementMetadata {
  attrs: AttrDef[] = [];
  listeners: Listener[] = [];
  onReady = new Set<Function>();
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
