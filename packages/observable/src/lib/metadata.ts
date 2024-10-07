(Symbol as any).metadata ??= Symbol('Symbol.metadata');

export type EffectFn = (changes: Changes) => void;

export class Changes extends Map<string | symbol, { oldValue: unknown; newValue: unknown }> {}

export class ObservableInstanceMetadata {
  scheduler: Promise<void> | null = null;
  changes = new Changes();
}

export class ObservableInstanceMetaDataStore extends WeakMap<object, ObservableInstanceMetadata> {
  read<T extends object>(key: T): ObservableInstanceMetadata {
    let data = this.get(key);

    if (!data) {
      data = new ObservableInstanceMetadata();

      this.set(key, data);
    }

    return data;
  }
}

export class ObservableMetadata {
  effects: Set<EffectFn> = new Set();
}

export class ObservableMetadataStore extends WeakMap<object, ObservableMetadata> {
  read<T extends object>(key: T): ObservableMetadata {
    let data = this.get(key);

    if (!data) {
      data = new ObservableMetadata();

      this.set(key, data);
    }

    return data;
  }
}

export const instanceMetadataStore = new ObservableInstanceMetaDataStore();
export const observableMetadataStore = new ObservableMetadataStore();
