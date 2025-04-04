import { type AttrChangedCallback, metadataStore } from "./metadata.js";

export function attrChanged(...names: string[]) {
  return function attrChangedDecorator<This extends HTMLElement>(
    cb: AttrChangedCallback,
    ctx: ClassMethodDecoratorContext<This>,
  ): void {
    const meta = metadataStore.read(ctx.metadata);

    for (const name of names) {
      const val = meta.attrChanges.get(name) ?? new Set();

      val.add(cb);

      meta.attrChanges.set(name, val);
    }
  };
}
