import { injectables, Injector } from './injector.js';
import { callLifecycle } from './lifecycle.js';
import { InjectableMetadata } from './metadata.js';
import { ConstructableToken } from './provider.js';

export function injectableEl<T extends ConstructableToken<HTMLElement>>(
  Base: T,
  ctx: ClassDecoratorContext
): T {
  const metadata: InjectableMetadata = ctx.metadata;

  const def = {
    [Base.name]: class extends Base {
      constructor(..._: any[]) {
        super();

        /**
         * Listen for the finddiroot event.
         * This is event is triggered when the element is connected to the dom
         * This event will bubble up until it finds a parent injector which is then attached
         * This will also work through shadow roots (that are not "closed")
         */
        this.addEventListener('finddiroot', (e) => {
          e.stopPropagation();

          const parentInjector = findInjectorRoot(e);

          if (parentInjector) {
            injectables.get(this)?.setParent(parentInjector);
          }

          callLifecycle(this, metadata?.onInjected);
        });

        callLifecycle(this, metadata?.onCreated);
      }

      connectedCallback() {
        if (this.isConnected) {
          this.dispatchEvent(new Event('finddiroot', { bubbles: true, composed: true }));

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
    }
  };

  return def[Base.name];
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

    // stop checking at the document body
    if (part === document.body) {
      return null;
    }
  }

  return null;
}
