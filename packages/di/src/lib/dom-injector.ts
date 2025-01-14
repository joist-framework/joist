import { INJECTOR_CTX } from "./context/injector.js";
import {
  ContextRequestEvent,
  type UnknownContext,
} from "./context/protocol.js";
import { Injector } from "./injector.js";

export class DOMInjector extends Injector {
  #controller: AbortController | null = null;

  attach(element: HTMLElement): void {
    this.#controller = new AbortController();

    element.addEventListener(
      "context-request",
      (e: ContextRequestEvent<UnknownContext>) => {
        if (e.context === INJECTOR_CTX) {
          if (e.target !== element) {
            e.stopPropagation();

            e.callback(this);
          }
        }
      },
      { signal: this.#controller.signal },
    );

    element.dispatchEvent(
      new ContextRequestEvent(INJECTOR_CTX, (parent) => {
        this.setParent(parent);
      }),
    );
  }

  detach(): void {
    if (this.#controller) {
      this.#controller.abort();
    }
  }
}
