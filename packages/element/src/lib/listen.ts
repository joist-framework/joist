import { ListenerSelector, metadataStore } from './metadata.js';

export function listen<This extends HTMLElement>(event: string, selector?: ListenerSelector) {
  return function listenDecorator(value: (e: any) => void, ctx: ClassMethodDecoratorContext<This>) {
    const metadata = metadataStore.read(ctx.metadata);

    metadata.listeners.set(event, {
      cb: value,
      selector: selector ?? ((el: HTMLElement) => el.shadowRoot ?? el)
    });
  };
}
