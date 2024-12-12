(Symbol as any).metadata ??= Symbol('Symbol.metadata');

import { InjectableMetadata } from './metadata.js';

export function injected() {
  return function onInjectDecorator(val: Function, ctx: ClassMethodDecoratorContext): void {
    const metadata: InjectableMetadata = ctx.metadata;
    metadata.onInjected ??= [];
    metadata.onInjected.push(val);
  };
}

export function created() {
  return function onInjectDecorator(val: Function, ctx: ClassMethodDecoratorContext): void {
    const metadata: InjectableMetadata = ctx.metadata;
    metadata.onCreated ??= [];
    metadata.onCreated.push(val);
  };
}
