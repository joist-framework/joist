import { EffectFn, observableMetadataStore } from "./metadata.js";

export function watch(value: new () => object, cb: EffectFn) {
  const key = value[Symbol.metadata];

  if (key) {
    const meta = observableMetadataStore.read(key);

    meta.effects.add(cb);
  }
}
