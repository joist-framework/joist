const schedulers = new WeakMap<object, Promise<void>>();
const effects = new WeakMap<object, Set<Function>>();

export function observe<T extends object>(
  base: ClassAccessorDecoratorTarget<T, any>,
  _: ClassAccessorDecoratorContext
): ClassAccessorDecoratorResult<T, any> {
  return {
    set(value: any) {
      let scheduler = schedulers.get(this);

      if (!scheduler) {
        scheduler = Promise.resolve().then(() => {
          schedulers.delete(this);

          const instanceEffects = effects.get(this);

          if (instanceEffects) {
            for (let effect of instanceEffects) {
              effect.call(this);
            }
          }
        });

        schedulers.set(this, scheduler);
      }

      base.set.call(this, value);
    },
  };
}

export function effect<T extends object>(value: Function, ctx: ClassMethodDecoratorContext<T>) {
  ctx.addInitializer(function () {
    let instanceEffects = effects.get(this);

    if (!instanceEffects) {
      instanceEffects = new Set();
      effects.set(this, instanceEffects);
    }

    instanceEffects.add(value);
  });
}
