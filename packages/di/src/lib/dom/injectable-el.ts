import { INJECTOR_CTX } from "../context/injector.js";
import { ContextRequestEvent } from "../context/protocol.js";
import { INJECTOR } from "../injector.js";
import type { Injector } from "../injector.js";
import { callLifecycle } from "../lifecycle.js";
import type { InjectableMetadata } from "../metadata.js";
import type { ConstructableToken } from "../provider.js";

export function injectableEl<
  T extends ConstructableToken<HTMLElement & { [INJECTOR]: Injector }>,
>(Base: T, ctx: ClassDecoratorContext): T {
  const metadata: InjectableMetadata = ctx.metadata;

  const def = {
    [Base.name]: class extends Base {
      constructor(..._: any[]) {
        super();

        const injector = this[INJECTOR];

        this.addEventListener("context-request", (e) => {
          if (e.target !== this && e.context === INJECTOR_CTX) {
            e.stopPropagation();

            e.callback(injector);
          }
        });

        callLifecycle(this, injector, metadata?.onCreated);
      }

      connectedCallback() {
        this.dispatchEvent(
          new ContextRequestEvent(INJECTOR_CTX, (ctx) => {
            this[INJECTOR].parent = ctx;
          }),
        );

        callLifecycle(this, this[INJECTOR], metadata?.onInjected);

        if (super.connectedCallback) {
          super.connectedCallback();
        }
      }

      disconnectedCallback() {
        if (super.disconnectedCallback) {
          super.disconnectedCallback();
        }

        this[INJECTOR].parent = undefined;
      }
    },
  };

  return def[Base.name];
}
