(Symbol as any).metadata ??= Symbol('Symbol.metadata');

import { ElementMetadata } from './element.js';

export function tagName<This extends typeof HTMLElement>(
  _val: unknown,
  ctx: ClassFieldDecoratorContext<This, string>
) {
  ctx.metadata.el ??= new ElementMetadata();
  const meta = ctx.metadata.el as ElementMetadata;
  meta.tagName = ctx.access.get;
}
