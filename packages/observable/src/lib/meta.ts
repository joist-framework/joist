(Symbol as any).metadata ??= Symbol('Symbol.metadata');

export type EffectFn = (changes: Set<string | symbol>) => void;

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

export class ObservableInstanceMetadata {
  scheduler: Promise<void> | null = null;
  changes = new Set<string | symbol>();
}

export class ObservableInstanceMetaDataStore extends MetadataStore<ObservableInstanceMetadata> {
  init() {
    return new ObservableInstanceMetadata();
  }
}

export class ObservableMetadata {
  effects: Set<EffectFn> = new Set();
}

export class ObservableMetadataStore extends MetadataStore<ObservableMetadata> {
  init() {
    return new ObservableMetadata();
  }
}

export const instanceMetadataStore = new ObservableInstanceMetaDataStore();
export const observableMetadataStore = new ObservableMetadataStore();
