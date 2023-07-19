import { ProviderToken } from './provider.js';
import { Injectable, Injector } from './injector.js';
import { environment } from './environment.js';

export function injectable<T extends ProviderToken<any>>(Base: T, _?: unknown) {
  return class InjectableNode extends Base implements Injectable {
    injector$$ = new Injector(Base.providers);

    constructor(..._: any[]) {
      super();

      try {
        if (this instanceof HTMLElement) {
          this.addEventListener('finddiroot', (e) => {
            const parentInjector = findInjectorRoot(e);

            if (parentInjector !== null) {
              this.injector$$.setParent(parentInjector);
            } else {
              this.injector$$.setParent(environment());
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
      this.injector$$.setParent(undefined);

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

    if ('injector$$' in part && part.injector$$ instanceof Injector) {
      return part.injector$$;
    }
  }

  return null;
}
