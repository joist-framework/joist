import { ProviderToken } from './provider.js';
import { Injector } from './injector.js';
import { environment } from './environment.js';

export const INJECTABLES = new WeakMap<object, Injector>();

export function injectable<T extends ProviderToken<any>>(Base: T, _?: unknown) {
  return class InjectableNode extends Base {
    constructor(..._: any[]) {
      super();

      const injector = new Injector(Base.providers);

      INJECTABLES.set(this, injector);

      try {
        if (this instanceof HTMLElement) {
          this.addEventListener('finddiroot', (e) => {
            const parentInjector = findInjectorRoot(e);

            if (parentInjector !== null) {
              injector.setParent(parentInjector);
            } else {
              injector.setParent(environment());
            }
          });
        }
      } catch {}
    }

    onInject() {
      if (super.onInject) {
        super.onInject();
      }
    }

    connectedCallback() {
      try {
        if (this instanceof HTMLElement) {
          this.dispatchEvent(new Event('finddiroot'));

          if (super.connectedCallback) {
            super.connectedCallback();
          }
        }
      } catch {}
    }

    disconnectedCallback() {
      const injector = INJECTABLES.get(this);

      if (injector) {
        injector.setParent(undefined);
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

    const injector = INJECTABLES.get(part);

    if (injector) {
      return injector;
    }
  }

  return null;
}
