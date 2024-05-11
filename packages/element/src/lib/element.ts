import { metadataStore } from './metadata.js';

export function element<Target extends CustomElementConstructor>(
  Base: Target,
  ctx: ClassDecoratorContext<Target>,
) {
  const meta = metadataStore.read(ctx.metadata);

  ctx.addInitializer(function (this: Target) {
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
    constructor(...args: any[]) {
      super(...args);

      const root = this.shadowRoot || this;

      for (let [event, listener] of meta.listeners) {
        root.addEventListener(event, listener.bind(this));
      }
    }

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
