import { type ListenerSelector, metadataStore } from "./metadata.js";

export function listen<This extends HTMLElement>(
  event: string,
  selector?: ListenerSelector<This> | string,
) {
  return function listenDecorator(
    value: (e: any) => void,
    ctx: ClassMethodDecoratorContext<This>,
  ): void {
    const metadata = metadataStore.read<This>(ctx.metadata);

    let selectorInternal: ListenerSelector<This> = (el) => el.shadowRoot ?? el;

    if (selector) {
      if (typeof selector === "string") {
        selectorInternal = (el: This) => {
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
      selector: selectorInternal,
    });
  };
}
