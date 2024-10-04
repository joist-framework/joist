import { EffectFn, instanceMetadataStore, observableMetadataStore } from './metadata.js';

export function observe() {
  return function observeDecorator<This extends object, Value extends This[keyof This]>(
    base: ClassAccessorDecoratorTarget<This, Value>,
    ctx: ClassAccessorDecoratorContext<This, Value>
  ): ClassAccessorDecoratorResult<This, Value> {
    const observableMeta = observableMetadataStore.read(ctx.metadata);

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

        if (instanceMeta.scheduler === null) {
          instanceMeta.scheduler = Promise.resolve().then(() => {
            for (let effect of observableMeta.effects) {
              effect.call(this, instanceMeta.changes);
            }

            instanceMeta.scheduler = null;
            instanceMeta.changes = {};
          });
        }

        const name = ctx.name as keyof This;

        instanceMeta.changes[name] = {
          oldValue: base.get.call(this),
          newValue: value
        };

        base.set.call(this, value);
      }
    };
  };
}

export function effect() {
  return function effectDecorator<T extends object>(
    value: EffectFn<unknown>,
    ctx: ClassMethodDecoratorContext<T>
  ) {
    const data = observableMetadataStore.read(ctx.metadata);

    data.effects.add(value);
  };
}
