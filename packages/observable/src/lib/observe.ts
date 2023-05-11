// metadata
const schedulers = new WeakMap<object, Promise<void>>();
const changes = new WeakMap<object, Set<string | symbol>>();
const upgradableProps = new WeakMap<object, Map<string | symbol, unknown>>();

// TODO: this one may not be worth it. could just call a named method on object
const effects = new WeakMap<object, Set<Function>>();

export function observe<This extends object, Value>(
  base: ClassAccessorDecoratorTarget<This, Value>,
  ctx: ClassAccessorDecoratorContext<This, Value>
): ClassAccessorDecoratorResult<This, Value> {
  // handle upgradable values (specifically custom elements)
  ctx.addInitializer(function (this: This) {
    let value;

    try {
      value = ctx.access.get(this);
    } catch {}

    if (value) {
      // if there is a value, delete it and cache it for init
      delete (<any>this)[ctx.name];

      let upgradable = upgradableProps.get(this);

      if (!upgradable) {
        upgradable = new Map();
        upgradableProps.set(this, upgradable);
      }

      upgradable.set(ctx.name, value);
    }
  });

  return {
    init(value) {
      const props = upgradableProps.get(this);

      if (props) {
        if (props.has(ctx.name)) {
          return props.get(ctx.name) as Value;
        }
      }

      return value;
    },
    set(value) {
      let scheduler = schedulers.get(this);
      let changeSet = changes.get(this);

      if (!changeSet) {
        changeSet = new Set();

        changes.set(this, changeSet);
      }

      if (!scheduler) {
        scheduler = Promise.resolve().then(() => {
          const effectFns = effects.get(this);

          if (effectFns) {
            for (let effect of effectFns) {
              effect.call(this, changeSet);
            }
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
    let effectFns = effects.get(this);

    if (!effectFns) {
      effectFns = new Set();

      effects.set(this, effectFns);
    }

    effectFns.add(value);
  });
}
