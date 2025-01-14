import { ContextRequestEvent, UnknownContext } from './context/protocol.js';
import { INJECTOR_CTX } from './context/injector.js';
import { Injector } from './injector.js';

export class DOMInjector extends Injector {
  #element: HTMLElement | null = null;
  #controller: AbortController | null = null;

  attach(element: HTMLElement): void {
    this.#element = element;
    this.#controller = new AbortController();

    this.#element.addEventListener(
      'context-request',
      (e: ContextRequestEvent<UnknownContext>) => {
        if (e.context === INJECTOR_CTX) {
          if (e.target !== this.#element) {
            e.stopPropagation();

            e.callback(this);
          }
        }
      },
      { signal: this.#controller.signal }
    );

    this.#element.dispatchEvent(
      new ContextRequestEvent(INJECTOR_CTX, (parent) => {
        this.setParent(parent);
      })
    );
  }

  detach(): void {
    if (this.#controller) {
      this.#controller.abort();
    }
  }
}
