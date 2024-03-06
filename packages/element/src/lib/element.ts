import { metadataStore } from './metadata.js';

export function element<T extends new (...args: any[]) => HTMLElement>(
  Base: T,
  ctx: ClassDecoratorContext<T>
) {
  const meta = metadataStore.read(ctx.metadata);

  ctx.addInitializer(function (this: T) {
    if (meta.tagName) {
      const val = meta.tagName(this);

      if (!customElements.get(val)) {
        customElements.define(val, this);
      }
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
