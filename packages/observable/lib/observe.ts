const schedulers = new WeakMap<object, Promise<void>>();
const effects = new WeakMap<object, Set<Function>>();
const changes = new WeakMap<object, Set<string | symbol>>();

export function observe<This extends object, Value>(
  base: ClassAccessorDecoratorTarget<This, Value>,
  ctx: ClassAccessorDecoratorContext<This, Value>
): ClassAccessorDecoratorResult<This, Value> {
  ctx.addInitializer(function () {
    // initialize effect and change set
    effects.set(this, new Set());
    changes.set(this, new Set());
  });

  return {
    set(value: Value) {
      let scheduler = schedulers.get(this);
      let changeSet = changes.get(this)!; // assume exists

      changeSet.add(ctx.name);

      if (!scheduler) {
        scheduler = Promise.resolve().then(() => {
          for (let effect of effects.get(this)!) {
            effect.call(this, new Set(changeSet));
          }

          schedulers.delete(this);
          changeSet.clear();
        });

        schedulers.set(this, scheduler);
      }

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
