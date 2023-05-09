export function attr<This extends HTMLElement>(
  _: ClassAccessorDecoratorTarget<This, unknown>,
  ctx: ClassAccessorDecoratorContext<This>
): ClassAccessorDecoratorResult<This, any> {
  return {
    init(value: unknown) {
      if (typeof ctx.name === 'string') {
        if (this.hasAttribute(ctx.name)) {
          ctx.access.set(this, this.getAttribute(ctx.name));
        } else {
          this.setAttribute(ctx.name, String(value));
        }
      }
    },
    set(value: unknown) {
      if (typeof ctx.name === 'string') {
        this.setAttribute(ctx.name, String(value));
      }
    },
    get() {
      if (typeof ctx.name === 'string') {
        return this.getAttribute(ctx.name);
      } else {
        return '';
      }
    },
  };
}
