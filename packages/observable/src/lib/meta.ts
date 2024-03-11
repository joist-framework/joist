(Symbol as any).metadata ??= Symbol('Symbol.metadata');

export type EffectFn = (changes: Set<string | symbol>) => void;

export abstract class MetadataStore<Metadata> {
  #data = new WeakMap<object, Metadata>();

  read<T extends object>(value: T): Metadata {
    let data = this.#data.get(value);

    if (!data) {
      data = this.init();

      this.#data.set(value, this.init());
    }

    return data;
  }

  abstract init(): Metadata;
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
