import { instanceMetadataStore, observe, ObserveOpts } from "@joist/observable";

export interface BindOpts<This, Value> extends ObserveOpts<This, Value> {
  /**
   * Trigger bindings on every change cycle, regardless of value,
   * newValue and oldValue will be the same in that case
   **/
  alwaysUpdate?: boolean;
}

export function bind<This extends HTMLElement, Value>(opts: BindOpts<This, Value> = {}) {
  return function bindDecorator(
    base: ClassAccessorDecoratorTarget<This, Value>,
    ctx: ClassAccessorDecoratorContext<This, Value>,
  ): ClassAccessorDecoratorResult<This, Value> {
    const internalObserve = observe(opts)(base, ctx);

    return {
      init(value) {
        this.addEventListener("joist::value", (e) => {
          if (e.token.bindTo === ctx.name) {
            const instanceMeta = instanceMetadataStore.read<This>(this);

            e.stopPropagation();

            e.update({
              oldValue: null,
              newValue: ctx.access.get(this),
              alwaysUpdate: opts.alwaysUpdate,
            });

            instanceMeta.bindings.add((changes) => {
              const key = ctx.name as keyof This;
              const change = changes.get(key);

              if (change) {
                e.update({ ...change, alwaysUpdate: opts.alwaysUpdate });
              } else if (opts.alwaysUpdate) {
                const value = ctx.access.get(this);

                e.update({
                  oldValue: value,
                  newValue: value,
                  alwaysUpdate: opts.alwaysUpdate,
                });
              }
            });
          }
        });

        if (internalObserve.init) {
          return internalObserve.init.call(this, value) as Value;
        }

        return value;
      },
      get: internalObserve.get,
      set: internalObserve.set,
    };
  };
}
