import { metadataStore } from './metadata.js';

export interface ElementOpts {
  tagName?: string;
}

export function element(opts?: ElementOpts) {
  return <Target extends CustomElementConstructor>(
    Base: Target,
    ctx: ClassDecoratorContext<Target>
  ) => {
    const meta = metadataStore.read(ctx.metadata);

    ctx.addInitializer(function (this: Target) {
      if (opts?.tagName) {
        if (!customElements.get(opts.tagName)) {
          customElements.define(opts.tagName, this);
        }
      }
    });

    return class JoistElement extends Base {
      // make all attrs observable
      static observedAttributes = meta.attrs.map(({ attrName }) => attrName);

      constructor(...args: any[]) {
        super(...args);

        const root = this.shadowRoot || this;

        for (let [event, listener] of meta.listeners) {
          root.addEventListener(event, listener.bind(this));
        }
      }

      connectedCallback() {
        for (let { propName, attrName } of meta.attrs) {
          const value = Reflect.get(this, propName);

          // reflect values back to attributes
          if (value !== null && value !== undefined && value !== '') {
            if (typeof value === 'boolean') {
              if (value === true) {
                // set boolean attribute
                this.setAttribute(attrName, '');
              }
            } else {
              // set key/value attribute
              this.setAttribute(attrName, String(value));
            }
          }
        }

        if (super.connectedCallback) {
          super.connectedCallback();
        }
      }
    };
  };
}
