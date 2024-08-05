import { injectables, Injector } from './injector.js';

export class DOMInjector extends Injector {
  attach(root: HTMLElement) {
    injectables.set(root, this);
  }

  detach(root: HTMLElement) {
    injectables.delete(root);
  }
}
