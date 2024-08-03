import { ConstructableToken, Provider } from './provider.js';
import { injectables, Injector } from './injector.js';

export interface InjectableOpts {
  providers: Provider<unknown>[];
}

export function injectable(opts?: InjectableOpts) {
  return function injectableDecorator<T extends ConstructableToken<any>>(Base: T, _?: unknown) {
    const connectedCallback = Base.prototype.connectedCallback;
    const disconnectedCallback = Base.prototype.disconnectedCallback;

    Base.prototype.connectedCallback = function (this: HTMLElement) {
      this.dispatchEvent(new Event('finddiroot'));

      if (connectedCallback) {
        connectedCallback.call(this);
      }
    };

    Base.prototype.disconnectedCallback = function (this: HTMLElement) {
      const injector = injectables.get(this);

      if (injector) {
        injector.setParent(undefined);
      }

      if (disconnectedCallback) {
        disconnectedCallback.call(this);
      }
    };

    return new Proxy(Base, {
      construct(target, args, newTarget) {
        const injector = new Injector(opts?.providers);

        const instance = Reflect.construct(target, args, newTarget);

        injectables.set(instance, injector);

        if (instance instanceof EventTarget) {
          instance.addEventListener('finddiroot', (e) => {
            const parentInjector = findInjectorRoot(e);

            if (parentInjector !== null) {
              injector.setParent(parentInjector);
            }
          });
        }

        return instance;
      }
    });
  };
}

function findInjectorRoot(e: Event): Injector | null {
  const path = e.composedPath();

  // find firt parent
  // skips the first item which is the target
  for (let i = 1; i < path.length; i++) {
    const part = path[i];

    const injector = injectables.get(part);

    if (injector) {
      return injector;
    }
  }

  return null;
}
