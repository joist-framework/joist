import { AttrDef, metadataStore } from './metadata.js';
import { ShadowResult } from './result.js';

export interface ElementOpts<T extends HTMLElement> {
  tagName?: string;
  shadow?: Array<ShadowResult<T> | ((el: T) => void)>;
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
              res.apply(this as unknown as Instance);
            }
          }
        }

        for (let { event, cb, selector } of meta.listeners) {
          const root = selector(this);

          if (root) {
            root.addEventListener(event, cb.bind(this));
          } else {
            throw new Error(`could not add listener to ${root}`);
          }
        }

        for (let cb of meta.onReady) {
          cb.call(this);
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

      attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        const ogValue = Reflect.get(this, name);

        if (newValue !== null) {
          if (newValue === '') {
            // treat as boolean
            Reflect.set(this, name, true);
          } else if (typeof ogValue === 'number') {
            // treat as number
            Reflect.set(this, name, Number(newValue));
          } else {
            // treat as string
            Reflect.set(this, name, newValue);
          }
        }

        if (super.attributeChangedCallback) {
          super.attributeChangedCallback(name, oldValue, newValue);
        }
      }
    };
  };
}

function reflectAttributeValues(el: HTMLElement, attrs: AttrDef[]) {
  for (let { propName, attrName, reflect } of attrs) {
    if (reflect) {
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
}
