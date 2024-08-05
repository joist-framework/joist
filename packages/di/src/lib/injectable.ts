import { ConstructableToken, Provider } from './provider.js';
import { injectables, Injector } from './injector.js';

export interface InjectableOpts {
  providers?: Provider<unknown>[];
}

export function injectable(opts?: InjectableOpts) {
  return function injectableDecorator<T extends ConstructableToken<any>>(
    Base: T,
    ctx: ClassDecoratorContext
  ) {
    class InjectableNode extends Base {
      constructor(..._: any[]) {
        super();

        const injector = new Injector(opts?.providers);
        injectables.set(this, injector);
      }
    }

    if ('HTMLElement' in globalThis) {
      if (HTMLElement.prototype.isPrototypeOf(Base.prototype)) {
        return injectableEl(InjectableNode, ctx);
      }
    }

    return InjectableNode;
  };
}

function injectableEl<T extends ConstructableToken<HTMLElement>>(
  Base: T,
  _ctx: ClassDecoratorContext
) {
  return class InjectablElementeNode extends Base {
    constructor(..._: any[]) {
      super();

      this.addEventListener('finddiroot', (e) => {
        const parentInjector = findInjectorRoot(e);

        if (parentInjector) {
          injectables.get(this)?.setParent(parentInjector);
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
      injectables.get(this)?.setParent(undefined);

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

    const injector = injectables.get(part);

    if (injector) {
      return injector;
    }
  }

  return null;
}
