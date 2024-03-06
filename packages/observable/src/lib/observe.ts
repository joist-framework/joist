// ensure that the metadata symbol exists

import { EffectFn, instanceMetadataStore, observableMetadataStore } from './meta.js';

export function observe<This extends object, Value>(
  base: ClassAccessorDecoratorTarget<This, Value>,
  ctx: ClassAccessorDecoratorContext<This, Value>
): ClassAccessorDecoratorResult<This, Value> {
  // handle upgradable values (specifically custom elements)
  ctx.addInitializer(function (this: This) {
    const instanceMeta = instanceMetadataStore.read(this);

    let value: Value | undefined;

    // attempt to read value.
    try {
      value = ctx.access.get(this);
    } catch {}

    if (value) {
      // if there is a value, delete it and cache it for init
      delete (<any>this)[ctx.name];

      instanceMeta.upgradable.set(ctx.name, value);
    }
  });

  return {
    init(value) {
      const instanceMeta = instanceMetadataStore.read(this);

      if (instanceMeta.upgradable.has(ctx.name)) {
        return instanceMeta.upgradable.get(ctx.name) as Value;
      }

      return value;
    },
    set(value) {
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
