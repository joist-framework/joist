import { ConstructableToken } from './provider.js';
import { Injector } from './injector.js';
import { environment } from './environment.js';
import { InjectableMap } from './injectable-map.js';

export const INJECTABLE_MAP = new InjectableMap();

export function injectable<T extends ConstructableToken<any>>(Base: T, _?: unknown) {
  return class InjectableNode extends Base {
    constructor(..._: any[]) {
      super();

      // Define a new Injector and assiciate it with this instance of the service
      const injector = new Injector(Base.providers);
      INJECTABLE_MAP.set(this, injector);

      // If the current injectable instance is a HTMLElement preform additional startup logic
      // this will find and attach parent injectors
      if ('HTMLElement' in globalThis && this instanceof HTMLElement) {
        this.addEventListener('finddiroot', (e) => {
          const parentInjector = findInjectorRoot(e);

          if (parentInjector !== null) {
            injector.setParent(parentInjector);
          } else {
            injector.setParent(environment());
          }
        });
      }
    }

    connectedCallback() {
      if ('HTMLElement' in globalThis && this instanceof HTMLElement) {
        this.dispatchEvent(new Event('finddiroot'));

        if (super.connectedCallback) {
          super.connectedCallback();
        }
      }
    }

    disconnectedCallback() {
      const injector = INJECTABLE_MAP.get(this);

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

    const injector = INJECTABLE_MAP.get(part);

    if (injector) {
      return injector;
    }
  }

  return null;
}
