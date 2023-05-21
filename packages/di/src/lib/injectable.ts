import { ProviderToken } from './provider.js';
import { Injector } from './injector.js';
import { environment } from './environment.js';

const injectors = new WeakMap<EventTarget, Injector>();

export function injectable<T extends ProviderToken<HTMLElement>>(
  CustomElement: T,
  _ctx: ClassDecoratorContext
) {
  return class Injectable extends CustomElement implements Injectable {
    constructor(...args: any[]) {
      const injector = new Injector(CustomElement.providers, environment());

      if (args.length || !CustomElement.inject) {
        super(...args);
      } else {
        const deps = [];

        for (let i = 0; i < CustomElement.inject.length; i++) {
          const dep = CustomElement.inject[i];

          deps.push(() => injector.get(dep));
        }

        super(...deps);
      }

      injectors.set(this, injector);

      this.addEventListener('finddiroot', (e) => {
        const parentInjector = findInjectorRoot(e);

        if (parentInjector) {
          injector.parent = parentInjector;
        }
      });
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
