export function attr<This extends HTMLElement>(
  { get, set }: ClassAccessorDecoratorTarget<This, unknown>,
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
        }

        // should set attributes AFTER init to allow setup to complete
        // this causes attribute changed callback to fire
        // If the user attempts to read or write to this property in that cb it will fail
        // this also normalizes when the attributeChangedCallback is called in different rendering scenarios
        Promise.resolve().then(() => {
          const cached = get.call(this);

          if (cached !== null && cached !== undefined && cached !== '') {
            if (typeof cached === 'boolean') {
              if (cached === true) {
                // set boolean attribute
                this.setAttribute(ctx.name.toString(), '');
              }
            } else {
              // set key/value attribute
              this.setAttribute(ctx.name.toString(), String(cached));
            }
          }
        });
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

      return set.call(this, value);
    },
    get() {
      const ogValue = get.call(this);

      if (typeof ctx.name === 'string') {
        const attr = this.getAttribute(ctx.name);

        if (attr !== null) {
          // treat as boolean
          if (attr === '') {
            return true;
          }

          // treat as number
          if (typeof ogValue === 'number') {
            return Number(attr);
          }

          // treat as string
          return attr;
        }
      }

      // no readable value return original
      return ogValue;
    },
  };
}
