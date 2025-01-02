import { metadataStore } from './metadata.js';

export function attrChanged(name: string) {
  return function attrChangedDecorator<This extends HTMLElement>(
    cb: Function,
    ctx: ClassMethodDecoratorContext<This>
  ): void {
    const meta = metadataStore.read(ctx.metadata);
    const val = meta.attrChanges.get(name) ?? new Set();

    val.add(cb);

    meta.attrChanges.set(name, val);
  };
}
