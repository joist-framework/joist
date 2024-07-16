import { INJECTABLE_MAP, Injector, Provider } from '@joist/di';

import { metadataStore } from './metadata.js';
import { environment } from './environment.js';

export function element<Target extends CustomElementConstructor & { providers?: Provider<any>[] }>(
  Base: Target,
  ctx: ClassDecoratorContext<Target>
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

      const injector = new Injector(Base.providers);

      INJECTABLE_MAP.set(this, injector);

      this.addEventListener('finddiroot', (e) => {
        const parentInjector = findInjectorRoot(e);

        if (parentInjector !== null) {
          injector.setParent(parentInjector);
        } else {
          injector.setParent(environment());
        }
      });
    }

    connectedCallback() {
      this.dispatchEvent(new Event('finddiroot'));

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

function findInjectorRoot(e: Event): Injector | null {
  const path = e.composedPath();

  // find firt parent
  // skips the first item which is the target
  for (let i = 1; i < path.length; i++) {
    const part = path[i];

    const injector = INJECTABLE_MAP.get(part);

    if (injector) {
      return injector;
    }
  }

  return null;
}
