import { ListenerRootSelector, metadataStore } from './metadata.js';

export function listen<This extends HTMLElement>(event: string, root?: ListenerRootSelector) {
  return function listenDecorator(
    value: (e: Event) => void,
    ctx: ClassMethodDecoratorContext<This>
  ) {
    const metadata = metadataStore.read(ctx.metadata);

    metadata.listeners.set(event, {
      cb: value,
      root: root ?? ((el: HTMLElement) => el.shadowRoot ?? el)
    });
  };
}
