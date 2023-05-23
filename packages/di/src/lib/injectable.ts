import { ProviderToken } from './provider.js';
import { Injector, injectors } from './injector.js';
import { environment } from './environment.js';

export function injectable<T extends ProviderToken<any>>(Base: T, _ctx: unknown) {
  return class extends Base {
    constructor(..._: any[]) {
      const injector = new Injector(Base.providers, environment());

      super((token: ProviderToken<any>) => injector.get(token));

      injectors.set(this, injector);

      if (this instanceof HTMLElement) {
        this.addEventListener('finddiroot', (e) => {
          const parentInjector = findInjectorRoot(e);

          if (parentInjector) {
            injector.setParent(parentInjector);
          }
        });
      }

      if (typeof super.onInject === 'function') {
        super.onInject();
      }
    }

    connectedCallback() {
      this.dispatchEvent(new Event('finddiroot'));

      if (super.connectedCallback) {
        super.connectedCallback();
      }
    }

    disconnectedCallback() {
      const injector = injectors.get(this);

      if (injector) {
        delete injector.parent;
      }

      if (super.disconnectedCallback) {
        super.disconnectedCallback();
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

    if (injectors.has(part)) {
      return injectors.get(part) as Injector;
    }
  }

  return null;
}
