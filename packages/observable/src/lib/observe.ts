import { EffectFn, instanceMetadataStore, observableMetadataStore } from './metadata.js';

export function observe() {
  return function observeDecorator<This extends object, Value>(
    base: ClassAccessorDecoratorTarget<This, Value>,
    ctx: ClassAccessorDecoratorContext<This, Value>
  ): ClassAccessorDecoratorResult<This, Value> {
    return {
      init(value) {
        let val: Value | null = null;

        // START: Make upgradable custom elements work
        try {
          val = ctx.access.get(this);
        } catch {}

        if (val) {
          delete (<any>this)[ctx.name];

          return val;
        }
        // END

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

        instanceMeta.changes.set(ctx.name, {
          oldValue: base.get.call(this),
          newValue: value
        });

        base.set.call(this, value);
      }
    };
  };
}

export function effect() {
  return function effectDecorator<T extends object>(
    value: EffectFn,
    ctx: ClassMethodDecoratorContext<T>
  ) {
    const data = observableMetadataStore.read(ctx.metadata);

    data.effects.add(value);
  };
}
