import { ContextRequestEvent, INJECTOR_CTX } from './context.js';
import { injectables, Injector } from './injector.js';

export class DOMInjector extends Injector {
  #contextCallback = (e: ContextRequestEvent<{ __context__: unknown }>) => {
    if (e.context === INJECTOR_CTX) {
      e.stopPropagation();

      const event = e as ContextRequestEvent<typeof INJECTOR_CTX>;

      event.callback(this);
    }
  };

  attach(root: HTMLElement): void {
    root.addEventListener('context-request', this.#contextCallback);
  }

  detach(root: HTMLElement): void {
    injectables.delete(root);
  }
}
