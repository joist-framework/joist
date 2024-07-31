import { metadataStore } from './metadata.js';
import { ShadowResult } from './result.js';

export interface ElementOpts<T> {
  tagName?: string;
  shadow?: Array<ShadowResult | ((el: T) => void)>;
}

export function element<
  Target extends CustomElementConstructor,
  Instance extends InstanceType<Target>
>(opts?: ElementOpts<Instance>) {
  return function elementDecorator(Base: Target, ctx: ClassDecoratorContext<Target>) {
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
      static observedAttributes = meta.attrs
        .filter(({ observe }) => observe) // filter out attributes that are not to be observed
        .map(({ attrName }) => attrName);

      constructor(...args: any[]) {
        super(...args);

        if (opts?.shadow) {
          this.attachShadow({ mode: 'open' });

          for (let res of opts.shadow) {
            if (typeof res === 'function') {
              res(this as unknown as Instance);
            } else {
              res.run(this);
            }
          }
        }

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
