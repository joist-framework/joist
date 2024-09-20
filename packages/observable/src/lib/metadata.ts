(Symbol as any).metadata ??= Symbol('Symbol.metadata');

export type EffectFn = (changes: Changes) => void;

export class Changes extends Map<string | symbol, { oldValue: unknown; newValue: unknown }> {}

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
  changes = new Changes();
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
