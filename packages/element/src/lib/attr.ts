export function attr<This extends HTMLElement>(
  base: ClassAccessorDecoratorTarget<This, unknown>,
  ctx: ClassAccessorDecoratorContext<This>
): ClassAccessorDecoratorResult<This, any> {
  return {
    init(value: unknown) {
      if (typeof ctx.name === 'string') {
        if (this.hasAttribute(ctx.name)) {
          if (this.getAttribute(ctx.name) === '') {
            return true;
          }

          return this.getAttribute(ctx.name);
        } else if (typeof value === 'boolean' && value) {
          this.setAttribute(ctx.name, String(value));
        }
      }

      return value;
    },
    set(value: unknown) {
      if (typeof ctx.name === 'string') {
        setAttribute(this, ctx.name, value);
      }

      base.set.call(this, value);
    },
    get() {
      if (typeof ctx.name === 'string') {
        const attr = this.getAttribute(ctx.name);

        if (attr === '') {
          return true;
        }

        return attr;
      } else {
        return '';
      }
    },
  };
}

function setAttribute(el: HTMLElement, attr: string, value: unknown): void {
  if (typeof value === 'boolean') {
    if (value) {
      el.setAttribute(attr, '');
    } else {
      el.removeAttribute(attr);
    }
  } else {
    el.setAttribute(attr, String(value));
  }
}
