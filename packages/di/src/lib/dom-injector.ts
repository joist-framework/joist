import { INJECTABLE_MAP } from './injectable.js';
import { Injector } from './injector.js';

export class DOMInjector extends Injector {
  #root: HTMLElement | null = null;

  attach(root: HTMLElement) {
    if (this.#root) {
      this.detach();
    }

    this.#root = root;
    INJECTABLE_MAP.set(root, this);
  }

  detach() {
    if (this.#root) {
      INJECTABLE_MAP.delete(this.#root);

      this.#root = null;
    }
  }
}
