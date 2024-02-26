(Symbol as any).metadata ??= Symbol('Symbol.metadata');

import { ElementCtx, ElementMetadata } from './element.js';

export function tagName(_val: unknown, ctx: ClassFieldDecoratorContext & { metadata: ElementCtx }) {
  ctx.metadata.el ??= new ElementMetadata();
  const meta = ctx.metadata.el as ElementMetadata;

  meta.tagName = ctx.access.get;
}
