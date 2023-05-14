import { EffectFn, MetaData } from './meta.js';

const metaData = new MetaData();

export function observe<This extends object, Value>(
  base: ClassAccessorDecoratorTarget<This, Value>,
  ctx: ClassAccessorDecoratorContext<This, Value>
): ClassAccessorDecoratorResult<This, Value> {
  // handle upgradable values (specifically custom elements)
  ctx.addInitializer(function (this: This) {
    const meta = metaData.read(this);

    let value: Value | undefined;

    // attempt to read value.
    try {
      value = ctx.access.get(this);
    } catch {}

    if (value) {
      // if there is a value, delete it and cache it for init
      delete (<any>this)[ctx.name];

      meta.upgradable.set(ctx.name, value);
    }
  });

  return {
    init(value) {
      const meta = metaData.read(this);

      if (meta.upgradable.has(ctx.name)) {
        return meta.upgradable.get(ctx.name) as Value;
      }

      return value;
    },
    set(value) {
      const meta = metaData.read(this);

      if (meta.scheduler === null) {
        meta.scheduler = Promise.resolve().then(() => {
          for (let effect of meta.effects) {
            effect.call(this, meta.changes);
          }

          meta.scheduler = null;
          meta.changes.clear();
        });
      }

      meta.changes!.add(ctx.name);

      base.set.call(this, value);
    },
  };
}

export function effect<T extends object>(value: EffectFn, ctx: ClassMethodDecoratorContext<T>) {
  ctx.addInitializer(function () {
    metaData.read(this).effects.add(value);
  });
}
