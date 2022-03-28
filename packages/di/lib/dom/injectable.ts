import { Provider, ProviderToken } from '../provider';
import { Injector } from '../injector';
import { getEnvironmentRef } from './environment';

export interface Injectable {
  inject?: ProviderToken<any>[];
  providers?: Provider<any>[];

  new (...args: any[]): HTMLElement;
}

export type Injected<T> = () => T;

export function injectable<T extends Injectable>(CustomElement: T) {
  const { inject, providers } = CustomElement;

  return class InjectableElement extends CustomElement {
    injector: Injector;

    constructor(...args: any[]) {
      const injector = new Injector(providers, getEnvironmentRef());
      let injected: Injected<any>[] = [];

      if (args.length || !inject) {
        super(...args);
      } else {
        injected = inject.map((dep) => {
          return () => {
            return this.injector.get(dep);
          };
        });

        super(...injected);
      }

      this.injector = injector;

      this.addEventListener('finddiroot', (e) => {
        const parentInjector = findInjectorRoot(e);

        if (parentInjector) {
          this.injector.parent = parentInjector;
        }

        if (super.connectedCallback) {
          super.connectedCallback();
        }
      });
    }

    connectedCallback() {
      // only mark as an injector root if element defines providers
      if (providers) {
        this.setAttribute('joist-injector-root', 'true');
      }

      this.dispatchEvent(new Event('finddiroot'));
    }

    disconnectedCallback() {
      delete this.injector.parent;

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
    return Reflect.get(parentInjector, 'injector') as Injector;
  }

  return null;
}
