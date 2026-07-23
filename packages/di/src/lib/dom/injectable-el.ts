import { INJECTOR } from "../symbols.js";
import { INJECTOR_CTX } from "../context/injector.js";
import { ContextRequestEvent } from "../context/protocol.js";
import { Injector } from "../injector.js";
import { callLifecycle } from "../lifecycle.js";
import type { InjectableMetadata } from "../metadata.js";
import type { ConstructableToken } from "../provider.js";

export type InjectableEl = HTMLElement & { [INJECTOR]: Injector };

export function injectableEl<T extends ConstructableToken<InjectableEl>>(
  Base: T,
  ctx: ClassDecoratorContext,
): T {
  const metadata: InjectableMetadata<InjectableEl> = ctx.metadata;

  return class extends Base {
    static get name() {
      return Base.name;
    }

    constructor(..._: any[]) {
      super();

      const injector = this[INJECTOR];

      if (!injector) {
        this[INJECTOR] = new Injector();
      }

      callLifecycle(this, injector, metadata?.onCreated);

      this.addEventListener("context-request", (e) => {
        if (e.target !== this && e.context === INJECTOR_CTX) {
          e.stopPropagation();
          e.callback(injector);
        }
      });
    }

    connectedCallback() {
      this.dispatchEvent(
        new ContextRequestEvent(INJECTOR_CTX, (injector) => {
          this[INJECTOR].parent = injector;
        }),
      );

      callLifecycle(this, this[INJECTOR], metadata?.onInjected);

      if (super.connectedCallback) {
        super.connectedCallback();
      }
    }

    disconnectedCallback() {
      // super disconnect needs to be called first.
      // If not the context could be different since the element will be removed from the injector chain.
      // This leads to unexpected behaviors.
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }

      this[INJECTOR].parent = undefined;
    }
  };
}
