import { Provider, ProviderToken } from './provider.js';
import { Injectable, Injector, rootServices } from './injector.js';
import { environment } from './environment.js';

export function injectable<T extends ProviderToken<any>>(
  def: {
    provideInRoot?: boolean;
    providers?: Provider<any>[];
  } = {}
) {
  return function (Base: T, _: unknown) {
    const token = withInjector(Base, def.providers);

    if (def.provideInRoot) {
      rootServices.add(token);
    }

    return token;
  };
}

/**
 * This mixin is applied by the @injectable decorator.
 * Id defines an instance injector and registers custom element lifecycle hooks
 */
function withInjector<T extends ProviderToken<any>>(Base: T, providers: Provider<any>[] = []) {
  return class InjectableNode extends Base implements Injectable {
    injector$$ = new Injector(providers);

    constructor(..._: any[]) {
      super();

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
    }

    onInject() {
      if (super.onInject) {
        super.onInject();
      }
    }

    connectedCallback() {
      if (this instanceof HTMLElement) {
        this.dispatchEvent(new Event('finddiroot'));

        if (super.connectedCallback) {
          super.connectedCallback();
        }
      }
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
