import { metadataStore } from "./metadata.js";

export function attr<This extends HTMLElement>(
  { get, set }: ClassAccessorDecoratorTarget<This, unknown>,
  ctx: ClassAccessorDecoratorContext<This>,
): ClassAccessorDecoratorResult<This, any> {
  const name = String(ctx.name);
  const meta = metadataStore.read(ctx.metadata);
  meta.attrs.push(name);

  return {
    set(value: unknown) {
      if (value === true) {
        this.setAttribute(name, "");
      } else if (value === false) {
        this.removeAttribute(name);
      } else {
        this.setAttribute(name, String(value));
      }

      set.call(this, value);
    },
    get() {
      const ogValue = get.call(this);
      const attr = this.getAttribute(name);

      if (attr !== null) {
        // treat as boolean
        if (attr === "") {
          return true;
        }

        // treat as number
        if (typeof ogValue === "number") {
          return Number(attr);
        }

        // treat as string
        return attr;
      }

      // no readable value return original
      return ogValue;
    },
  };
}
