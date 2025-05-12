import { instanceMetadataStore, observe } from "@joist/observable";

export function bind<This extends HTMLElement, Value>(mapper?: (instance: This) => Value) {
  return function bindDecorator(
    base: ClassAccessorDecoratorTarget<This, Value>,
    ctx: ClassAccessorDecoratorContext<This, Value>,
  ): ClassAccessorDecoratorResult<This, Value> {
    const internalObserve = observe(mapper)(base, ctx);

    return {
      init(value) {
        this.addEventListener("joist::value", (e) => {
          if (e.token.bindTo === ctx.name) {
            const instanceMeta = instanceMetadataStore.read<This>(this);

            e.stopPropagation();

            e.update({ oldValue: null, newValue: ctx.access.get(this) });

            instanceMeta.bindings.add((changes) => {
              const key = ctx.name as keyof This;
              const res = changes.get(key);

              if (res) {
                e.update(res);
              }
            });
          }
        });

        if (internalObserve.init) {
          return internalObserve.init.call(this, value) as Value;
        }

        return value;
      },
      set: internalObserve.set,
    };
  };
}
