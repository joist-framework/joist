(Symbol as any).metadata ??= Symbol('Symbol.metadata');

export type EffectFn<T> = (changes: Changes<T>) => void;

export type Changes<T> = {
  [P in keyof T]?: {
    oldValue: T[P];
    newValue: T[P];
  };
};

export class ObservableInstanceMetadata<T> {
  scheduler: Promise<void> | null = null;
  changes: Changes<T> = {};
}

export class ObservableInstanceMetaDataStore extends WeakMap<
  object,
  ObservableInstanceMetadata<unknown>
> {
  read<T extends object>(key: T): ObservableInstanceMetadata<T> {
    let data = this.get(key);

    if (!data) {
      data = new ObservableInstanceMetadata();

      this.set(key, data);
    }

    return data;
  }
}

export class ObservableMetadata<T> {
  effects: Set<EffectFn<T>> = new Set();
}

export class ObservableMetadataStore extends WeakMap<object, ObservableMetadata<unknown>> {
  read<T extends object>(key: T): ObservableMetadata<T> {
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
