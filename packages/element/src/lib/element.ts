(Symbol as any).metadata ??= Symbol('Symbol.metadata');

export class ElementMetadata {
  attrs: string[] = [];
  tagName?: (val: unknown) => unknown;
}

export interface ElementCtx {
  el?: ElementMetadata;
}

export function element<T extends new (...args: any[]) => HTMLElement>(
  Base: T,
  ctx: ClassDecoratorContext<T>
) {
  ctx.metadata.el ??= new ElementMetadata();
  const meta = ctx.metadata.el as ElementMetadata;

  ctx.addInitializer(function (this: T) {
    const val = meta.tagName!(this) as string;

    if (!customElements.get(val)) {
      customElements.define(val, this);
    }
  });

  return class JoistElement extends Base {
    // make all attrs observable
    static observedAttributes = [...meta.attrs];

    connectedCallback() {
      for (let attr of meta.attrs) {
        const value = Reflect.get(this, attr);

        // reflect values back to attributes
        if (value !== null && value !== undefined && value !== '') {
          if (typeof value === 'boolean') {
            if (value === true) {
              // set boolean attribute
              this.setAttribute(attr, '');
            }
          } else {
            // set key/value attribute
            this.setAttribute(attr, String(value));
          }
        }
      }

      if (super.connectedCallback) {
        super.connectedCallback();
      }
    }
  };
}
