import { Injector } from './injector.js';
import { InjectableMetadata, LifecycleCallback } from './metadata.js';

export function injected() {
  return function onInjectDecorator(
    val: LifecycleCallback,
    ctx: ClassMethodDecoratorContext
  ): void {
    const metadata: InjectableMetadata = ctx.metadata;
    metadata.onInjected ??= new Set();
    metadata.onInjected.add(val);
  };
}

export function created() {
  return function onInjectDecorator(
    val: LifecycleCallback,
    ctx: ClassMethodDecoratorContext
  ): void {
    const metadata: InjectableMetadata = ctx.metadata;
    metadata.onCreated ??= new Set();
    metadata.onCreated.add(val);
  };
}

export function callLifecycle(
  instance: object,
  i: Injector,
  methods?: Set<LifecycleCallback>
): void {
  if (methods) {
    for (let cb of methods) {
      cb.call(instance, i);
    }
  }
}
