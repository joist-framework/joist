import { type EffectFn, instanceMetadataStore, observableMetadataStore } from "./metadata.js";

const INIT_VALUE = Symbol("init");

export interface ObserveOpts<This, Value> {
  compute?: (instance: This) => Value;
}

export function observe<This extends object, Value>(opts: ObserveOpts<This, Value> = {}) {
  return function observeDecorato(
    base: ClassAccessorDecoratorTarget<This, Value>,
    ctx: ClassAccessorDecoratorContext<This, Value>,
  ): ClassAccessorDecoratorResult<This, Value> {
    const observableMeta = observableMetadataStore.read<This>(ctx.metadata);

    const compute = opts.compute;

    if (compute) {
      observableMeta.effects.add(function mapperFn(this: This) {
        ctx.access.set(this, compute(this));
      });
    }

    return {
      init(value) {
        let val: Value | typeof INIT_VALUE = INIT_VALUE;

        // START: Make upgradable custom elements work
        try {
          val = ctx.access.get(this);
        } catch {}

        if (val !== INIT_VALUE) {
          Reflect.deleteProperty(this, ctx.name);

          return val;
        }
        // END

        return value;
      },
      get() {
        if (compute) {
          const instanceMeta = instanceMetadataStore.read<This>(this);

          if (!instanceMeta.initialized.has(ctx.name)) {
            instanceMeta.initialized.add(ctx.name);

            return compute(this);
          }
        }

        return base.get.call(this);
      },
      set(newValue: Value) {
        const oldValue = base.get.call(this);
        const instanceMeta = instanceMetadataStore.read<This>(this);

        if (newValue !== oldValue) {
          if (instanceMeta.scheduler === null) {
            instanceMeta.scheduler = Promise.resolve().then(() => {
              for (const effect of observableMeta.effects) {
                effect.call(this, instanceMeta.changes);
              }

              for (const binding of instanceMeta.bindings) {
                binding.call(this, instanceMeta.changes);
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
