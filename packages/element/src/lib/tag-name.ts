import { metadataStore } from './metadata.js';

export function tagName<This extends typeof HTMLElement>(
  _val: unknown,
  ctx: ClassFieldDecoratorContext<This, string>,
) {
  const metadata = metadataStore.read(ctx.metadata);

  metadata.tagName = ctx.access.get;
}
