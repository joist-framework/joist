import { AttrDef, metadataStore } from './metadata.js';
import { ShadowResult } from './result.js';

export interface ElementOpts<T> {
  tagName?: string;
  shadow?: Array<ShadowResult | ((el: T) => void)>;
}

export const LifeCycle = {
  onInit: Symbol('onInit')
};

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
      static observedAttributes = meta.attrs
        .filter(({ observe }) => observe) // filter out attributes that are not to be observed
        .map(({ attrName }) => attrName);

      constructor(...args: any[]) {
        super(...args);

        if (opts?.shadow) {
          if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
          }

          for (let res of opts.shadow) {
            if (typeof res === 'function') {
              res(this as unknown as Instance);
            } else {
              res.run(this);
            }
          }
        }

        for (let [event, { cb, root }] of meta.listeners) {
          root(this).addEventListener(event, cb.bind(this));
        }

        if (LifeCycle.onInit in this) {
          const onInit = Reflect.get(this, LifeCycle.onInit);

          if (typeof onInit === 'function') {
            onInit();
          }
        }
      }

      connectedCallback() {
        if (this.isConnected) {
          reflectAttributeValues(this, meta.attrs);

          if (super.connectedCallback) {
            super.connectedCallback();
          }
        }
      }
    };
  };
}

function reflectAttributeValues(el: HTMLElement, attrs: AttrDef[]) {
  for (let { propName, attrName } of attrs) {
    const value = Reflect.get(el, propName);

    // reflect values back to attributes
    if (value !== null && value !== undefined && value !== '') {
      if (typeof value === 'boolean') {
        if (value === true) {
          // set boolean attribute
          el.setAttribute(attrName, '');
        }
      } else {
        // set key/value attribute
        el.setAttribute(attrName, String(value));
      }
    }
  }
}
