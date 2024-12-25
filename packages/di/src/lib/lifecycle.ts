(Symbol as any).metadata ??= Symbol('Symbol.metadata');

import { Injector } from './injector.js';
import { InjectableMetadata, LifecycleCallback } from './metadata.js';

export function injected() {
  return function onInjectDecorator(
    val: LifecycleCallback,
    ctx: ClassMethodDecoratorContext
  ): void {
    const metadata: InjectableMetadata = ctx.metadata;
    metadata.onInjected ??= [];
    metadata.onInjected.push(val);
  };
}

export function created() {
  return function onInjectDecorator(
    val: LifecycleCallback,
    ctx: ClassMethodDecoratorContext
  ): void {
    const metadata: InjectableMetadata = ctx.metadata;
    metadata.onCreated ??= [];
    metadata.onCreated.push(val);
  };
}

export function callLifecycle(instance: object, i: Injector, methods?: LifecycleCallback[]): void {
  if (methods) {
    for (let cb of methods) {
      cb.call(instance, i);
    }
  }
}
