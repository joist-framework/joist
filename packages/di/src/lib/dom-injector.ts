import { INJECTOR_CTX } from "./context/injector.js";
import {
  ContextRequestEvent,
  type UnknownContext,
} from "./context/protocol.js";
import { Injector } from "./injector.js";

/**
 * Special Injector that allows you to register an injector with a particular DOM element.
 */
export class DOMInjector extends Injector {
  #element: HTMLElement | null = null;
  #controller: AbortController | null = null;

  get isAttached(): boolean {
    return this.#element !== null && this.#controller !== null;
  }

  attach(element: HTMLElement): void {
    if (this.isAttached) {
      throw new Error(
        `This DOMInjector is already attached to ${this.#element}. Detach first before attaching again`,
      );
    }

    this.#element = element;
    this.#controller = new AbortController();

    this.#element.addEventListener(
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

    this.#element.dispatchEvent(
      new ContextRequestEvent(INJECTOR_CTX, (parent) => {
        this.parent = parent;
      }),
    );
  }

  detach(): void {
    if (this.#controller) {
      this.#controller.abort();
    }

    this.#element = null;
  }
}
