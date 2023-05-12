type EffectFn = (changes: Set<string | symbol>) => void;

interface ObservableMeta {
  s$$?: Promise<void> | null; // scheduler
  p$$?: Map<string | symbol, unknown>; // upgradeable props
  c$$?: Set<string | symbol>; // changeset
  e$$?: Set<EffectFn>; // effects
}

export function observe<This extends object & ObservableMeta, Value>(
  base: ClassAccessorDecoratorTarget<This, Value>,
  ctx: ClassAccessorDecoratorContext<This, Value>
): ClassAccessorDecoratorResult<This, Value> {
  // handle upgradable values (specifically custom elements)
  ctx.addInitializer(function (this: This) {
    let value: Value | undefined;

    // attempt to read value.
    try {
      value = ctx.access.get(this);
    } catch {}

    if (value) {
      // if there is a value, delete it and cache it for init
      delete (<any>this)[ctx.name];

      this.p$$ = this.p$$ || new Map();
      this.p$$.set(ctx.name, value);
    }
  });

  return {
    init(value) {
      if (this.p$$) {
        if (this.p$$.has(ctx.name)) {
          return this.p$$.get(ctx.name) as Value;
        }
      }

      return value;
    },
    set(value) {
      this.c$$ = this.c$$ || new Set();

      if (!this.s$$) {
        this.s$$ = Promise.resolve().then(() => {
          if (this.e$$ && this.c$$) {
            for (let effect of this.e$$) {
              effect.call(this, this.c$$);
            }
          }

          this.s$$ = null;
          this.c$$?.clear();
        });
      }

      this.c$$.add(ctx.name);

      base.set.call(this, value);
    },
  };
}

export function effect<T extends object & ObservableMeta>(
  value: EffectFn,
  ctx: ClassMethodDecoratorContext<T>
) {
  ctx.addInitializer(function () {
    this.e$$ = this.e$$ || new Set();

    this.e$$.add(value);
  });
}
