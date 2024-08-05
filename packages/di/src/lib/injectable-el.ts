import { injectables, Injector } from './injector.js';
import { ConstructableToken } from './provider.js';

export function injectableEl<T extends ConstructableToken<HTMLElement>>(
  Base: T,
  _ctx: ClassDecoratorContext
) {
  return class InjectablElementeNode extends Base {
    constructor(..._: any[]) {
      super();

      /**
       * Listen for the finddiroot event.
       * This is event is triggered when the element is connected to the dom
       * This event will bubble up until it finds a parent injector which is then attached
       * This will also work through shadow roots (that are not "closed")
       */
      this.addEventListener('finddiroot', (e) => {
        const parentInjector = findInjectorRoot(e);

        if (parentInjector) {
          injectables.get(this)?.setParent(parentInjector);
        }
      });
    }

    connectedCallback() {
      if (this.isConnected) {
        this.dispatchEvent(new Event('finddiroot', { bubbles: true }));

        if (super.connectedCallback) {
          super.connectedCallback();
        }
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
