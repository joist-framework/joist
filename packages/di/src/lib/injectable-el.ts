import { injectables, Injector } from './injector.js';
import { callLifecycle } from './lifecycle.js';
import { InjectableMetadata } from './metadata.js';
import { ConstructableToken } from './provider.js';

export class FindInjectorEvent extends Event {
  callback: (i: Injector) => void;

  constructor(callback: (i: Injector) => void) {
    super('findinjectorroot', { bubbles: true, composed: true });

    this.callback = callback;
  }
}

export function injectableEl<T extends ConstructableToken<HTMLElement>>(
  Base: T,
  ctx: ClassDecoratorContext
): T {
  const metadata: InjectableMetadata = ctx.metadata;

  const def = {
    [Base.name]: class extends Base {
      constructor(..._: any[]) {
        super();

        // assume injector exists
        const injector = injectables.get(this);

        this.addEventListener('findinjectorroot', (e) => {
          if (e instanceof FindInjectorEvent) {
            e.stopPropagation();

            if (injector) {
              e.callback(injector);
            }
          }
        });

        if (injector) {
          callLifecycle(this, injector, metadata?.onCreated);
        }
      }

      connectedCallback() {
        if (this.isConnected) {
          this.dispatchEvent(
            new FindInjectorEvent((i) => {
              const injector = injectables.get(this);

              if (injector) {
                injector.setParent(i);

                callLifecycle(this, injector, metadata?.onInjected);
              }
            })
          );

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

// function findInjectorRoot(e: Event): Injector | null {
//   const path = e.composedPath();

//   // find firt parent
//   // skips the first item which is the target
//   for (let i = 1; i < path.length; i++) {
//     const part = path[i];

//     const injector = injectables.get(part);

//     if (injector) {
//       return injector;
//     }

//     // stop checking at the document body
//     if (part === document.body) {
//       return null;
//     }
//   }

//   return null;
// }
