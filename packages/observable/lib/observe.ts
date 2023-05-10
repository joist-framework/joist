// metadata
const schedulers = new WeakMap<object, Promise<void>>();
const changes = new WeakMap<object, Set<string | symbol>>();
const effects = new WeakMap<object, Set<Function>>();

export function observe<This extends object, Value>(
  base: ClassAccessorDecoratorTarget<This, Value>,
  ctx: ClassAccessorDecoratorContext<This, Value>
): ClassAccessorDecoratorResult<This, Value> {
  return {
    set(value: Value) {
      let scheduler = schedulers.get(this);
      let changeSet = changes.get(this);

      if (!changeSet) {
        changeSet = new Set();

        changes.set(this, changeSet);
      }

      if (!scheduler) {
        scheduler = Promise.resolve().then(() => {
          for (let effect of effects.get(this)!) {
            effect.call(this, changeSet);
          }

          schedulers.delete(this);
          changes.delete(this);
        });

        schedulers.set(this, scheduler);
      }

      changeSet.add(ctx.name);

      base.set.call(this, value);
    },
  };
}

export function effect<T extends object>(
  value: (changes: Set<keyof T>) => void,
  ctx: ClassMethodDecoratorContext<T>
) {
  ctx.addInitializer(function () {
    effects.get(this)?.add(value);
  });
}
