import { AttrMetadata, metadataStore } from './metadata.js';
import { ShadowResult } from './result.js';

export interface ElementOpts {
  tagName?: string;
  shadowDom?: ShadowResult[];
  shadowDomOpts?: ShadowRootInit;
}

interface ElementConstructor {
  new (...args: any[]): HTMLElement;
}

export function element<T extends ElementConstructor>(opts?: ElementOpts) {
  return function elementDecorator(Base: T, ctx: ClassDecoratorContext<T>): T {
    const meta = metadataStore.read(ctx.metadata);

    ctx.addInitializer(function () {
      if (opts?.tagName) {
        if (!customElements.get(opts.tagName)) {
          customElements.define(opts.tagName, this);
        }
      }
    });

    const def = {
      [Base.name]: class extends Base {
        static observedAttributes: string[] = Array.from(meta.attrs.keys());

        #abortController: AbortController | null = null;

        constructor(...args: any[]) {
          super(...args);

          if (opts?.shadowDom) {
            if (!this.shadowRoot) {
              this.attachShadow(opts.shadowDomOpts ?? { mode: 'open' });
            }

            for (let res of opts.shadowDom) {
              res.apply(this);
            }
          }

          for (let cb of meta.onReady) {
            cb.call(this);
          }
        }

        attributeChangedCallback(name: string, oldValue: string, newValue: string) {
          const attr = meta.attrs.get(name);
          const cbs = meta.attrChanges.get(name);

          if (attr) {
            if (oldValue !== newValue) {
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

            if (cbs) {
              for (let cb of cbs) {
                cb.call(this, oldValue, newValue);
              }
            }

            if (attr.observe) {
              if (super.attributeChangedCallback) {
                super.attributeChangedCallback(name, oldValue, newValue);
              }
            }
          }
        }

        connectedCallback() {
          if (this.isConnected) {
            for (let { event, cb, selector } of meta.listeners) {
              const root = selector(this);

              if (root) {
                this.#abortController = new AbortController();

                root.addEventListener(event, cb.bind(this), {
                  signal: this.#abortController.signal
                });
              } else {
                throw new Error(`could not add listener to ${root}`);
              }
            }

            reflectAttributeValues(this, meta.attrs);

            if (super.connectedCallback) {
              super.connectedCallback();
            }
          }
        }

        disconnectedCallback(): void {
          if (this.#abortController) {
            this.#abortController.abort();
            this.#abortController = null;
          }

          if (super.disconnectedCallback) {
            super.disconnectedCallback();
          }
        }
      }
    };

    return def[Base.name];
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
            if (!el.hasAttribute(attrName)) {
              el.setAttribute(attrName, '');
            }
          }
        } else {
          // set key/value attribute
          const strValue = String(value);

          if (el.getAttribute(attrName) !== strValue) {
            el.setAttribute(attrName, strValue);
          }
        }
      }
    }
  }
}
