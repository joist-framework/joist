// ensure that the metadata symbol exists

import { EffectFn, instanceMetadataStore, observableMetadataStore } from './meta.js';

export function observe<This extends object, Value>(
  base: ClassAccessorDecoratorTarget<This, Value>,
  ctx: ClassAccessorDecoratorContext<This, Value>
): ClassAccessorDecoratorResult<This, Value> {
  return {
    init(value) {
      // let val: Value | null = null;

      // try {
      //   val = ctx.access.get(this);
      // } catch {}

      // if (val !== null) {
      //   return val;
      // }

      return value;
    },
    set(value) {
      console.log('SETTING VALUE', value);

      const instanceMeta = instanceMetadataStore.read(this);
      const observableMeta = observableMetadataStore.read(ctx.metadata);

      if (instanceMeta.scheduler === null) {
        instanceMeta.scheduler = Promise.resolve().then(() => {
          for (let effect of observableMeta.effects) {
            effect.call(this, instanceMeta.changes);
          }

          instanceMeta.scheduler = null;
          instanceMeta.changes.clear();
        });
      }

      instanceMeta.changes.add(ctx.name);

      base.set.call(this, value);
    },
  };
}

export function effect<T extends object>(value: EffectFn, ctx: ClassMethodDecoratorContext<T>) {
  const data = observableMetadataStore.read(ctx.metadata);

  data.effects.add(value);
}
