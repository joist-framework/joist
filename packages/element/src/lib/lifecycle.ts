import { metadataStore } from "./metadata.js";

export function ready() {
  return function readyDecorator(
    val: () => void,
    ctx: ClassMethodDecoratorContext,
  ): void {
    const metadata = metadataStore.read(ctx.metadata);

    metadata.onReady.add(val);
  };
}
