export function attr<This extends HTMLElement>(
  _: ClassAccessorDecoratorTarget<This, unknown>,
  ctx: ClassAccessorDecoratorContext<This>
): ClassAccessorDecoratorResult<This, any> {
  return {
    init(value: unknown) {
      if (typeof ctx.name === 'string') {
        if (this.hasAttribute(ctx.name)) {
          const attr = this.getAttribute(ctx.name);

          return attr === '' ? true : attr;
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
    },
    get() {
      if (typeof ctx.name === 'string') {
        const attr = this.getAttribute(ctx.name);

        return attr === '' ? true : attr;
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
