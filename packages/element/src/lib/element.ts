import { type AttrMetadata, metadataStore } from "./metadata.js";
import type { ShadowResult } from "./result.js";

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
              this.attachShadow(opts.shadowDomOpts ?? { mode: "open" });
            }

            for (const res of opts.shadowDom) {
              res.apply(this);
            }
          }

          for (const cb of meta.onReady) {
            cb.call(this);
          }
        }

        attributeChangedCallback(name: string, oldValue: string, newValue: string) {
          const attr = meta.attrs.get(name);
          const cbs = meta.attrChanges.get(name);

          if (attr) {
            if (oldValue !== newValue) {
              const sourceValue = attr.access.get.call(this);
              let value: string | number | boolean;

              if (typeof sourceValue === "boolean") {
                // treat as boolean
                value = newValue !== null;
              } else if (typeof sourceValue === "number") {
                // treat as number
                value = Number(newValue);
              } else {
                // treat as string
                value = newValue;
              }

              attr.access.set.call(this, value);
            }

            if (cbs) {
              for (const cb of cbs) {
                cb.call(this, name, oldValue, newValue);
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
          if (!this.#abortController) {
            this.#abortController = new AbortController();

            for (const { event, cb, selector } of meta.listeners) {
              const root = selector(this);

              if (root) {
                root.addEventListener(event, cb.bind(this), {
                  signal: this.#abortController.signal,
                });
              } else {
                throw new Error(`could not add listener to ${root}`);
              }
            }
          }

          reflectAttributeValues(this, meta.attrs);

          if (super.connectedCallback) {
            super.connectedCallback();
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
      },
    };

    return def[Base.name];
  };
}

function reflectAttributeValues<T extends HTMLElement>(el: T, attrs: AttrMetadata) {
  for (const [attrName, { access, reflect }] of attrs) {
    if (reflect) {
      const value = access.get.call(el);

      // reflect values back to attributes
      if (value !== null && value !== undefined && value !== "") {
        if (typeof value === "boolean") {
          if (value === true) {
            // set boolean attribute
            if (!el.hasAttribute(attrName)) {
              el.setAttribute(attrName, "");
            }
          }
        } else if (!el.hasAttribute(attrName)) {
          // only set parent attribute if it doesn't exist
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
