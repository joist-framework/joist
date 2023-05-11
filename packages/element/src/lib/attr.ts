export function attr<This extends HTMLElement>(
  _: ClassAccessorDecoratorTarget<This, unknown>,
  ctx: ClassAccessorDecoratorContext<This>
): ClassAccessorDecoratorResult<This, any> {
  return {
    init(value: unknown) {
      if (typeof ctx.name === 'string') {
        if (this.hasAttribute(ctx.name)) {
          const attrVal = this.getAttribute(ctx.name);

          ctx.access.set(this, attrVal === '' ? true : this.getAttribute(ctx.name));
        } else {
          setAttribute(this, ctx.name, value);
        }
      }
    },
    set(value: unknown) {
      if (typeof ctx.name === 'string') {
        setAttribute(this, ctx.name, value);
      }
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
