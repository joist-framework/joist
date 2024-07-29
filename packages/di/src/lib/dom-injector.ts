import { INJECTABLE_MAP } from './injectable.js';
import { Injector } from './injector.js';

export class DOMInjector extends Injector {
  attach(root: HTMLElement) {
    INJECTABLE_MAP.set(root, this);
  }

  detach(root: HTMLElement) {
    INJECTABLE_MAP.delete(root);
  }
}
