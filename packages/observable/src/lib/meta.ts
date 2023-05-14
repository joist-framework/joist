export type EffectFn = (changes: Set<string | symbol>) => void;

export interface ObservableMetaData {
  scheduler: Promise<void> | null;
  upgradable: Map<string | symbol, unknown>;
  changes: Set<string | symbol>;
  effects: Set<EffectFn>;
}

export class MetaData {
  #data = new WeakMap<object, ObservableMetaData>();

  read<T extends object>(value: T) {
    if (this.#data.has(value)) {
      return this.#data.get(value) as ObservableMetaData;
    }

    const data: ObservableMetaData = {
      changes: new Set(),
      effects: new Set(),
      upgradable: new Map(),
      scheduler: null,
    };

    this.#data.set(value, data);

    return data;
  }
}
