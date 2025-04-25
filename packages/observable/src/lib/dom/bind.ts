import { instanceMetadataStore } from "../metadata.js";
import { observe } from "../observe.js";

export function bind() {
  return function bindDecorator<This extends HTMLElement, Value>(
    base: ClassAccessorDecoratorTarget<This, Value>,
    ctx: ClassAccessorDecoratorContext<This, Value>,
  ): ClassAccessorDecoratorResult<This, Value> {
    const internalObserve = observe()(base, ctx);

    return {
      init(value) {
        this.addEventListener("joist::value", (e) => {
          if (e.token.bindTo === ctx.name) {
            const instanceMeta = instanceMetadataStore.read<This>(this);

            e.stopPropagation();

            e.cb({ oldValue: null, newValue: ctx.access.get(this) });

            instanceMeta.bindings.add((changes) => {
              const key = ctx.name as keyof This;
              const res = changes.get(key);

              if (res) {
                e.cb(res);
              }
            });
          }
        });

        if (internalObserve.init) {
          return internalObserve.init.call(this, value);
        }

        return value;
      },
      set: internalObserve.set,
    };
  };
}
