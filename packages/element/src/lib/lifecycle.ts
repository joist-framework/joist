import { metadataStore } from './metadata.js';

export function ready() {
  return function readyDecorator(val: Function, ctx: ClassMethodDecoratorContext) {
    const metadata = metadataStore.read(ctx.metadata);

    metadata.onReady.add(val);
  };
}
