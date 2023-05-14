export function attr<This extends HTMLElement>(
  base: ClassAccessorDecoratorTarget<This, unknown>,
  ctx: ClassAccessorDecoratorContext<This>
): ClassAccessorDecoratorResult<This, any> {
  return {
    init(value: unknown) {
      if (typeof ctx.name === 'string') {
        if (this.hasAttribute(ctx.name)) {
          const attr = this.getAttribute(ctx.name);

          // treat as boolean
          if (attr === '') {
            return true;
          }

          // treat as number
          if (typeof value === 'number') {
            return Number(attr);
          }

          // treat as string
          return attr;
        } else if (value === true) {
          // set boolean attribute
          this.setAttribute(ctx.name, '');
        } else {
          // set key/value attribute
          this.setAttribute(ctx.name, String(value));
        }
      }

      return value;
    },
    set(value: unknown) {
      if (typeof ctx.name === 'string') {
        if (typeof value === 'boolean') {
          if (value) {
            this.setAttribute(ctx.name, '');
          } else {
            this.removeAttribute(ctx.name);
          }
        } else {
          this.setAttribute(ctx.name, String(value));
        }
      }

      base.set.call(this, value);
    },
    get() {
      const ogValue = base.get.call(this);

      if (typeof ctx.name === 'string') {
        const attr = this.getAttribute(ctx.name);

        // treat as attribute
        if (attr === '') {
          return true;
        }

        // treat as number
        if (typeof ogValue === 'number') {
          return Number(attr);
        }

        // treat as string
        return attr;
      } else {
        return ogValue;
      }
    },
  };
}
