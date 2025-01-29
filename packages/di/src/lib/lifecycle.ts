import type { Injector } from "./injector.js";
import type { InjectableMetadata, LifecycleCallback } from "./metadata.js";

export function injected() {
  return function onInjectDecorator(
    val: LifecycleCallback,
    ctx: ClassMethodDecoratorContext,
  ): void {
    const metadata: InjectableMetadata = ctx.metadata;
    metadata.onInjected ??= [];
    metadata.onInjected.push(val);
  };
}

export function created() {
  return function onInjectDecorator(
    val: LifecycleCallback,
    ctx: ClassMethodDecoratorContext,
  ): void {
    const metadata: InjectableMetadata = ctx.metadata;
    metadata.onCreated ??= [];
    metadata.onCreated.push(val);
  };
}

export function callLifecycle(
  instance: object,
  i: Injector,
  methods?: LifecycleCallback[],
): void {
  if (methods) {
    for (const cb of methods) {
      cb.call(instance, i);
    }
  }
}
