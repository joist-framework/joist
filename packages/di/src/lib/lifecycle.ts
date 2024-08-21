import { InjectableMetadata } from './metadata';

(Symbol as any).metadata ??= Symbol('Symbol.metadata');

export function injected() {
  return function onInjectDecorator(val: Function, ctx: ClassMethodDecoratorContext) {
    const metadata: InjectableMetadata = ctx.metadata;
    metadata.onInjected ??= [];
    metadata.onInjected.push(val);
  };
}

export function created() {
  return function onInjectDecorator(val: Function, ctx: ClassMethodDecoratorContext) {
    const metadata: InjectableMetadata = ctx.metadata;
    metadata.onCreated ??= [];
    metadata.onCreated.push(val);
  };
}
