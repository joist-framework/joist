import {
  type EffectFn,
  instanceMetadataStore,
  observableMetadataStore,
} from "./metadata.js";

export function observe() {
  return function observeDecorator<
    This extends object,
    Value extends This[keyof This],
  >(
    base: ClassAccessorDecoratorTarget<This, Value>,
    ctx: ClassAccessorDecoratorContext<This, Value>,
  ): ClassAccessorDecoratorResult<This, Value> {
    const observableMeta = observableMetadataStore.read<This>(ctx.metadata);

    return {
      init(value) {
        let val: Value | null = null;

        // START: Make upgradable custom elements work
        try {
          val = ctx.access.get(this);
        } catch {}

        if (val) {
          Reflect.deleteProperty(this, ctx.name);

          return val;
        }
        // END

        return value;
      },
      set(newValue: Value) {
        const oldValue = base.get.call(this);

        if (newValue !== oldValue) {
          const instanceMeta = instanceMetadataStore.read<This>(this);

          if (instanceMeta.scheduler === null) {
            instanceMeta.scheduler = Promise.resolve().then(() => {
              for (const effect of observableMeta.effects) {
                effect.call(this, instanceMeta.changes);
              }

              instanceMeta.scheduler = null;
              instanceMeta.changes.clear();
            });
          }

          instanceMeta.changes.set(ctx.name as keyof This, {
            oldValue,
            newValue,
          });

          base.set.call(this, newValue);
        }
      },
    };
  };
}

export function effect() {
  return function effectDecorator<T extends object>(
    value: EffectFn<T>,
    ctx: ClassMethodDecoratorContext<T>,
  ): void {
    const data = observableMetadataStore.read<T>(ctx.metadata);

    data.effects.add(value);
  };
}
