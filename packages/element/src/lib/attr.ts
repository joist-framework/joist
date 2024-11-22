import { metadataStore } from './metadata.js';

export interface AttrOpts {
  observed?: boolean;
  reflect?: boolean;
}

export function attr(opts?: AttrOpts) {
  return function attrDecorator<This extends HTMLElement>(
    { get, set }: ClassAccessorDecoratorTarget<This, unknown>,
    ctx: ClassAccessorDecoratorContext<This>
  ): ClassAccessorDecoratorResult<This, any> {
    const attrName = parseAttrName(ctx.name);
    const meta = metadataStore.read(ctx.metadata);
    const reflect = opts?.reflect ?? true;

    meta.attrs.push({
      propName: ctx.name,
      attrName,
      observe: opts?.observed ?? true,
      reflect
    });

    return {
      set(value: unknown) {
        if (reflect) {
          if (value === true) {
            this.setAttribute(attrName, '');
          } else if (value === false) {
            this.removeAttribute(attrName);
          } else {
            this.setAttribute(attrName, String(value));
          }
        }

        set.call(this, value);
      },
      get() {
        const ogValue = get.call(this);
        const attr = this.getAttribute(attrName);

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

        // no readable value return original
        return ogValue;
      }
    };
  };
}

function parseAttrName(val: string | symbol): string {
  let value: string;

  if (typeof val === 'symbol') {
    if (val.description) {
      value = val.description;
    } else {
      throw new Error('Cannot handle Symbol property without description');
    }
  } else {
    value = val;
  }

  return value.toLowerCase().replaceAll(' ', '-');
}
