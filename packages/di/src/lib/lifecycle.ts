import type { Injector } from "./injector.js";
import type {
  InjectableMetadata,
  LifecycleCallback,
  LifecycleCondition,
  LifecycleMethod,
} from "./metadata.js";

export function injected(condition?: LifecycleCondition) {
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

export function created(condition?: LifecycleCondition) {
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

export function callLifecycle(
  instance: object,
  i: Injector,
  methods?: LifecycleMethod[],
): void {
  if (methods) {
    for (const { callback, condition } of methods) {
      if (condition) {
        const result = condition(i);
        if (result.enabled === false) {
          continue;
        }
      }
      callback.call(instance, i);
    }
  }
}
