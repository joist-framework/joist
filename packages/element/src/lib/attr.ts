import { metadataStore } from "./metadata.js";

export interface AttrOpts {
  name?: string;
  observed?: boolean;
  reflect?: boolean;
}

export function attr<This extends HTMLElement>(opts?: AttrOpts) {
  return function attrDecorator(
    base: ClassAccessorDecoratorTarget<This, unknown>,
    ctx: ClassAccessorDecoratorContext<This>,
  ): ClassAccessorDecoratorResult<This, any> {
    const attrName = opts?.name ?? parseAttrName(ctx.name);
    const meta = metadataStore.read<This>(ctx.metadata);
    const reflect = opts?.reflect ?? true;

    meta.attrs.set(attrName, {
      propName: ctx.name,
      observe: opts?.observed ?? true,
      reflect,
      access: base,
    });

    return {
      set(value: unknown) {
        if (reflect) {
          if (value === true) {
            if (!this.hasAttribute(attrName)) {
              this.setAttribute(attrName, "");
            }
          } else if (value === false) {
            if (this.hasAttribute(attrName)) {
              this.removeAttribute(attrName);
            }
          } else {
            const strValue = String(value);

            if (this.getAttribute(attrName) !== strValue) {
              this.setAttribute(attrName, strValue);
            }
          }
        }

        base.set.call(this, value);
      },
    };
  };
}

function parseAttrName(val: string | symbol): string {
  let value: string;

  if (typeof val === "symbol") {
    if (val.description) {
      value = val.description;
    } else {
      throw new Error("Cannot handle Symbol property without description");
    }
  } else {
    value = val;
  }

  return value.toLowerCase().replaceAll(" ", "-");
}
