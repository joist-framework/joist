import { ContextRequestEvent } from './context/protocol.js';
import { INJECTOR_CTX } from './context/injector.js';
import { Injector } from './injector.js';

export class DOMInjector extends Injector {
  #contextCallback = (e: ContextRequestEvent<{ __context__: unknown }>) => {
    if (e.context === INJECTOR_CTX) {
      if (e.target !== this.#element) {
        e.stopPropagation();

        e.callback(this);
      }
    }
  };

  #element: HTMLElement | null = null;

  attach(element: HTMLElement): void {
    this.#element = element;

    this.#element.addEventListener('context-request', this.#contextCallback);

    this.#element.dispatchEvent(
      new ContextRequestEvent(INJECTOR_CTX, (parent) => {
        this.setParent(parent);
      })
    );
  }

  detach(): void {
    if (this.#element) {
      this.#element.removeEventListener('context-request', this.#contextCallback);
    }
  }
}
