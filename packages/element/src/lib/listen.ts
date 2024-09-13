import { ListenerSelector, metadataStore } from './metadata.js';

export function listen<This extends HTMLElement>(
  event: string,
  selector?: ListenerSelector | string
) {
  return function listenDecorator(value: (e: any) => void, ctx: ClassMethodDecoratorContext<This>) {
    const metadata = metadataStore.read(ctx.metadata);

    let selectorInternal: ListenerSelector = (el: Element) => el.shadowRoot ?? el;

    if (selector) {
      if (typeof selector === 'string') {
        selectorInternal = (el: Element) => {
          if (el.shadowRoot) {
            return el.shadowRoot.querySelector(selector);
          }

          return el.querySelector(selector);
        };
      } else {
        selectorInternal = selector;
      }
    }

    metadata.listeners.push({
      event,
      cb: value,
      selector: selectorInternal
    });
  };
}
