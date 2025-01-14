import { ContextRequestEvent } from './context/protocol.js';
import { INJECTOR_CTX } from './context/injector.js';
import { injectables } from './injector.js';
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

        const injector = injectables.get(this);

        if (injector) {
          this.addEventListener('context-request', (e) => {
            if (e.target !== this && e.context === INJECTOR_CTX) {
              e.stopPropagation();

              e.callback(injector);
            }
          });

          callLifecycle(this, injector, metadata?.onCreated);
        }
      }

      connectedCallback() {
        const injector = injectables.get(this);

        if (injector) {
          this.dispatchEvent(
            new ContextRequestEvent(INJECTOR_CTX, (ctx) => {
              injector.parent = ctx;
            })
          );

          callLifecycle(this, injector, metadata?.onInjected);
        }

        if (super.connectedCallback) {
          super.connectedCallback();
        }
      }

      disconnectedCallback() {
        const i = injectables.get(this);

        if (i) {
          delete i.parent;
        }

        if (super.disconnectedCallback) {
          super.disconnectedCallback();
        }
      }
    }
  };

  return def[Base.name];
}
