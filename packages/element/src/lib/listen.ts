import { metadataStore } from './metadata.js';

export function listen<This extends HTMLElement>(event: string) {
  return (value: (e: Event) => void, ctx: ClassMethodDecoratorContext<This>) => {
    const metadata = metadataStore.read(ctx.metadata);

    metadata.listeners.set(event, value);
  };
}
