import { Injectables, Injector } from './injector.js';

export class DOMInjector extends Injector {
  attach(root: HTMLElement) {
    Injectables.set(root, this);
  }

  detach(root: HTMLElement) {
    Injectables.delete(root);
  }
}
