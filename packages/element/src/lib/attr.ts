// ensure that the metadata symbol exists
(Symbol as any).metadata ??= Symbol('Symbol.metadata');

import { ElementMetadata } from './element.js';

export function attr<This extends HTMLElement>(
  { get, set }: ClassAccessorDecoratorTarget<This, unknown>,
  ctx: ClassAccessorDecoratorContext<This>
): ClassAccessorDecoratorResult<This, any> {
  ctx.metadata.el ??= new ElementMetadata();
  const meta = ctx.metadata.el as ElementMetadata;
  meta.attrs.push(String(ctx.name));

  return {
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
