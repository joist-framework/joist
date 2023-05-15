export type EffectFn = (changes: Set<string | symbol>) => void;

export class ObservableMetaData {
  scheduler: Promise<void> | null = null;
  upgradable = new Map<string | symbol, unknown>();
  changes = new Set<string | symbol>();
  effects = new Set<EffectFn>();
}

export class MetaData {
  #data = new WeakMap<object, ObservableMetaData>();

  read<T extends object>(value: T) {
    if (this.#data.has(value)) {
      return this.#data.get(value) as ObservableMetaData;
    }

    const data = new ObservableMetaData();

    this.#data.set(value, data);

    return data;
  }
}
