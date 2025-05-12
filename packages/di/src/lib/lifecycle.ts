import type { Injector } from "./injector.js";
import type {
  InjectableMetadata,
  LifecycleCallback,
  LifecycleCondition,
  LifecycleMethod,
} from "./metadata.js";

export function injected<T>(condition?: LifecycleCondition<T>) {
  return function onInjectDecorator(
    val: LifecycleCallback,
    ctx: ClassMethodDecoratorContext<T>,
  ): void {
    const metadata: InjectableMetadata<T> = ctx.metadata;
    metadata.onInjected ??= [];
    metadata.onInjected.push({
      callback: val,
      condition,
    });
  };
}

export function created<T>(condition?: LifecycleCondition<T>) {
  return function onInjectDecorator(
    val: LifecycleCallback,
    ctx: ClassMethodDecoratorContext<T>,
  ): void {
    const metadata: InjectableMetadata<T> = ctx.metadata;
    metadata.onCreated ??= [];
    metadata.onCreated.push({
      callback: val,
      condition,
    });
  };
}

export function callLifecycle(
  instance: object,
  injector: Injector,
  methods?: LifecycleMethod<any>[],
): void {
  if (methods) {
    for (const { callback, condition } of methods) {
      if (condition) {
        const result = condition({ injector, instance });
        if (result.enabled === false) {
          continue;
        }
      }
      callback.call(instance, injector);
    }
  }
}
