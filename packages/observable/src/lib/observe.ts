interface ObservableMeta {
  scheduler$$?: Promise<void> | null;
  upgradeableProps$$?: Map<string | symbol, unknown>;
  changes$$?: Set<string | symbol>;
  effects$$?: Set<Function>;
}

export function observe<This extends object & ObservableMeta, Value>(
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

      this.upgradeableProps$$ = this.upgradeableProps$$ || new Map();
      this.upgradeableProps$$.set(ctx.name, value);
    }
  });

  return {
    init(value) {
      if (this.upgradeableProps$$) {
        if (this.upgradeableProps$$.has(ctx.name)) {
          return this.upgradeableProps$$.get(ctx.name) as Value;
        }
      }

      return value;
    },
    set(value) {
      this.changes$$ = this.changes$$ || new Set();

      if (!this.scheduler$$) {
        this.scheduler$$ = Promise.resolve().then(() => {
          if (this.effects$$) {
            for (let effect of this.effects$$) {
              effect.call(this, this.changes$$);
            }
          }

          this.scheduler$$ = null;
          this.changes$$?.clear();
        });
      }

      this.changes$$.add(ctx.name);

      base.set.call(this, value);
    },
  };
}

export function effect<T extends object & ObservableMeta>(
  value: (changes: Set<keyof T>) => void,
  ctx: ClassMethodDecoratorContext<T>
) {
  ctx.addInitializer(function () {
    this.effects$$ = this.effects$$ || new Set();

    this.effects$$.add(value);
  });
}
