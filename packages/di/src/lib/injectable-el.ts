import { ContextRequestEvent } from './context.js';
import { injectables } from './injector.js';
import { callLifecycle } from './lifecycle.js';
import { InjectableMetadata } from './metadata.js';
import { ConstructableToken } from './provider.js';
import { INJECTOR_CTX } from './context.js';

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

        this.addEventListener('context-request', (e) => {
          if (e.target !== this) {
            if (e.context === INJECTOR_CTX) {
              e.stopPropagation();

              const event = e as ContextRequestEvent<typeof INJECTOR_CTX>;

              if (injector) {
                event.callback(injector);
              }
            }
          }
        });

        if (injector) {
          callLifecycle(this, injector, metadata?.onCreated);
        }
      }

      connectedCallback() {
        const injector = injectables.get(this);

        this.dispatchEvent(
          new ContextRequestEvent(INJECTOR_CTX, (parent) => {
            if (injector) {
              injector.setParent(parent);
            }
          })
        );

        if (injector) {
          callLifecycle(this, injector, metadata?.onInjected);
        }

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
    }
  };

  return def[Base.name];
}
