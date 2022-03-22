import { Provider, ProviderToken } from '../provider';
import { Injector } from '../injector';
import { getEnvironmentRef } from './environment';

export interface Injectable {
  inject?: ProviderToken<any>[];
  providers?: Provider<any>[];

  new (...args: any[]): HTMLElement;
}

export type Injected<T> = () => T;

export function injectable<T extends Injectable>(Clazz: T) {
  const { inject, providers } = Clazz;

  return class InjectableElement extends Clazz {
    injector: Injector;
    injected: Injected<any>[];

    constructor(...args: any[]) {
      const injector = new Injector({ providers }, getEnvironmentRef());
      let injected: Injected<any>[] = [];

      if (args.length || !inject) {
        super(...args);
      } else {
        injected = inject.map((dep) => () => injector.get(dep));

        super(...injected);
      }

      this.injector = injector;
      this.injected = injected;

      this.addEventListener('finddiroot', (e) => {
        const path = e.composedPath();

        const parentInjector = path.find((el) => {
          return el instanceof HTMLElement && el !== this && el.hasAttribute('joist-injector');
        });

        if (parentInjector) {
          const injectorHost = parentInjector as InjectableElement;

          this.injector.setParent(injectorHost.injector);

          if (super.connectedCallback) {
            super.connectedCallback();
          }
        }
      });
    }

    connectedCallback() {
      this.setAttribute('joist-injector', 'true');

      this.dispatchEvent(new Event('finddiroot'));
    }

    disconnectedCallback() {
      this.injector.setParent(undefined);

      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }
  };
}
