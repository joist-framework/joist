import { metadataStore } from './metadata.js';

export function templatReady() {
  return function templateReadyDecorator(val: Function, ctx: ClassMethodDecoratorContext) {
    const metadata = metadataStore.read(ctx.metadata);

    metadata.onTemplateReady.add(val);
  };
}
