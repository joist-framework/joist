import { ProviderToken } from './provider.js';
import { Injector } from './injector.js';
import { environment } from './environment.js';

interface Injectable extends HTMLElement {
  injector$$: Injector;
}

export function injectable<T extends ProviderToken<HTMLElement>>(
  CustomElement: T,
  _ctx: ClassDecoratorContext
) {
  return class Injectable extends CustomElement implements Injectable {
    injector$$: Injector;

    constructor(...args: any[]) {
      const injector = new Injector(CustomElement.providers, environment());

      if (args.length || !CustomElement.inject) {
        super(...args);
      } else {
        super(...CustomElement.inject.map((dep) => () => injector.get(dep)));
      }

      this.injector$$ = injector;

      this.addEventListener('finddiroot', (e) => {
        const parentInjector = findInjectorRoot(e);

        if (parentInjector) {
          this.injector$$.parent = parentInjector;
        }
      });
    }

    connectedCallback() {
      // only mark as an injector root if element defines providers
      if (CustomElement.providers) {
        this.setAttribute('joist-injector-root', '');
      }

      this.dispatchEvent(new Event('finddiroot'));

      if (super.connectedCallback) {
        super.connectedCallback();
      }
    }

    disconnectedCallback() {
      delete this.injector$$.parent;

      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }
  };
}

function findInjectorRoot(e: Event): Injector | null {
  const path = e.composedPath();

  const parentInjector = path.find((el) => {
    return el instanceof HTMLElement && el !== e.target && el.hasAttribute('joist-injector-root');
  });

  if (parentInjector) {
    return (parentInjector as Injectable).injector$$;
  }

  return null;
}
