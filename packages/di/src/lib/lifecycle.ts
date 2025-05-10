import type { Injector } from "./injector.js";
import type {
  InjectableMetadata,
  LifecycleCallback,
  LifecycleCondition,
  LifecycleMethod,
} from "./metadata.js";

export function injected<T extends object>(condition?: LifecycleCondition<T>) {
  return function onInjectDecorator(
    val: LifecycleCallback,
    ctx: ClassMethodDecoratorContext,
  ): void {
    const metadata: InjectableMetadata = ctx.metadata;
    metadata.onInjected ??= [];
    metadata.onInjected.push({
      callback: val,
      condition,
    });
  };
}

export function created<T extends object>(condition?: LifecycleCondition<T>) {
  return function onInjectDecorator(
    val: LifecycleCallback,
    ctx: ClassMethodDecoratorContext,
  ): void {
    const metadata: InjectableMetadata = ctx.metadata;
    metadata.onCreated ??= [];
    metadata.onCreated.push({
      callback: val,
      condition,
    });
  };
}

export function callLifecycle<T extends object>(
  instance: T,
  i: Injector,
  methods?: LifecycleMethod<T>[],
): void {
  if (methods) {
    for (const { callback, condition } of methods) {
      if (condition) {
        const result = condition(instance);
        if (result.enabled === false) {
          continue;
        }
      }
      callback.call(instance, i);
    }
  }
}
