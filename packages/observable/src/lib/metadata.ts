(Symbol as any).metadata ??= Symbol('Symbol.metadata');

export type EffectFn = (changes: Set<string | symbol>) => void;

export abstract class MetadataStore<Metadata> extends WeakMap<object, Metadata> {
  read(key: object): Metadata {
    let data = this.get(key);

    if (!data) {
      data = this.init();

      this.set(key, data);
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
