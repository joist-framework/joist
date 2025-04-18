// import { observableMetadataStore } from "../metadata.js";
import { observableMetadataStore } from "../metadata.js";
import { observe } from "../observe.js";

export function bind() {
  return function bindDecorator<This extends HTMLElement, Value>(
    base: ClassAccessorDecoratorTarget<This, Value>,
    ctx: ClassAccessorDecoratorContext<This, Value>,
  ): ClassAccessorDecoratorResult<This, Value> {
    const observableMeta = observableMetadataStore.read<This>(ctx.metadata);

    const internalObserver = observe()(base, ctx);

    return {
      init(value) {
        if (this instanceof HTMLElement) {
          this.addEventListener("joist::value", (e) => {
            if (e.bindTo === ctx.name) {
              e.stopPropagation();

              e.cb(value);

              observableMeta.effects.add((changes) => {
                const key = ctx.name as keyof This;

                if (changes.has(key)) {
                  const res = changes.get(key);

                  return e.cb(res?.newValue);
                }
              });
            }
          });
        }

        if (internalObserver.init) {
          return internalObserver.init.call(this, value);
        }

        return value;
      },
      set: internalObserver.set,
    };
  };
}
