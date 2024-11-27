import { AttrMetadata, metadataStore } from './metadata.js';
import { ShadowResult } from './result.js';

export interface ElementOpts {
  tagName?: string;
  shadowDom?: ShadowResult[];
  shadowDomMode?: 'open' | 'closed';
}

interface ElementConstructor {
  new (...args: any[]): HTMLElement;
}

export function element<T extends ElementConstructor>(opts?: ElementOpts) {
  return function elementDecorator(Base: T, ctx: ClassDecoratorContext<T>) {
    const meta = metadataStore.read(ctx.metadata);

    ctx.addInitializer(function () {
      if (opts?.tagName) {
        if (!customElements.get(opts.tagName)) {
          customElements.define(opts.tagName, this);
        }
      }
    });

    return class JoistElement extends Base {
      static observedAttributes: string[] = [];

      static {
        for (let [attrName, { observe }] of meta.attrs) {
          if (observe) {
            this.observedAttributes.push(attrName);
          }
        }
      }

      constructor(...args: any[]) {
        super(...args);

        if (opts?.shadowDom) {
          if (!this.shadowRoot) {
            this.attachShadow({ mode: opts.shadowDomMode ?? 'open' });
          }

          for (let res of opts.shadowDom) {
            res.apply(this);
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
        const attr = meta.attrs.get(name);

        if (attr && oldValue !== newValue) {
          const ogValue = attr.getPropValue.call(this);

          if (newValue === '') {
            // treat as boolean
            attr.setPropValue.call(this, true);
          } else if (typeof ogValue === 'number') {
            // treat as number
            attr.setPropValue.call(this, Number(newValue));
          } else {
            // treat as string
            attr.setPropValue.call(this, newValue);
          }
        }

        if (super.attributeChangedCallback) {
          super.attributeChangedCallback(name, oldValue, newValue);
        }
      }
    };
  };
}

function reflectAttributeValues<T extends HTMLElement>(el: T, attrs: AttrMetadata) {
  for (let [attrName, { getPropValue, reflect }] of attrs) {
    if (reflect) {
      const value = getPropValue.call(el);

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
