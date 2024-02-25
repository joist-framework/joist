export class ElementMetadata {
  attrs: string[] = [];
}

export interface ElementCtx {
  metadata: {
    el: ElementMetadata;
  };
}

export function element<T extends new (...args: any[]) => HTMLElement>(
  Base: T,
  ctx: ClassDecoratorContext<T>
) {
  const { metadata } = ctx as unknown as ElementCtx;

  return class JoistElement extends Base {
    // make all attrs observable
    static observedAttributes = [...metadata.el.attrs];

    constructor(...args: any[]) {
      super(...args);
    }

    connectedCallback() {
      for (let attr of metadata.el.attrs) {
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
