import { injectables, Injector } from './injector.js';

export class DOMInjector extends Injector {
  attach(root: HTMLElement): void {
    injectables.set(root, this);
  }

  detach(root: HTMLElement): void {
    injectables.delete(root);
  }
}
