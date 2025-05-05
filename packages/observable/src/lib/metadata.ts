(Symbol as any).metadata ??= Symbol("Symbol.metadata");

export type EffectFn<T> = (changes: Changes<T>) => void;

export interface Change<T> {
  oldValue: T;
  newValue: T;
}

export class Changes<T> extends Map<keyof T, Change<unknown>> {}

export class ObservableInstanceMetadata<T> {
  scheduler: Promise<void> | null = null;
  changes: Changes<T> = new Changes();
  bindings: Set<(changes: Changes<T>) => void> = new Set();
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

    return data as ObservableInstanceMetadata<T>;
  }
}

export class ObservableMetadata<T> {
  effects: Set<EffectFn<T>> = new Set();
}

export class ObservableMetadataStore extends WeakMap<
  object,
  ObservableMetadata<unknown>
> {
  read<T extends object>(key: object): ObservableMetadata<T> {
    let data = this.get(key);

    if (!data) {
      data = new ObservableMetadata();

      this.set(key, data);
    }

    return data as ObservableMetadata<T>;
  }
}

export const instanceMetadataStore: ObservableInstanceMetaDataStore =
  new ObservableInstanceMetaDataStore();

export const observableMetadataStore: ObservableMetadataStore =
  new ObservableMetadataStore();
