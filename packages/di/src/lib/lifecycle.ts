import type { Injector } from "./injector.js";
import { MetadataMap } from "./util/metadata-map.js";

export type LifecycleCallback = (i: Injector) => void;

export type LifecycleCondition<T> = (ctx: { injector: Injector; instance: T }) => {
  enabled?: boolean | undefined;
};

export interface LifecycleMethod<T> {
  callback?: LifecycleCallback | undefined;
  condition?: LifecycleCondition<T> | undefined;
}

export const injectedHooks = new MetadataMap<LifecycleMethod<any>[]>(() => []);
export const createdHooks = new MetadataMap<LifecycleMethod<any>[]>(() => []);

export function injected<T>(condition?: LifecycleCondition<T>) {
  return function (val: LifecycleCallback, ctx: ClassMethodDecoratorContext<T>): void {
    let hooks = injectedHooks.read(ctx.metadata);

    hooks.push({ callback: val, condition });
  };
}

export function created<T>(condition?: LifecycleCondition<T>) {
  return function (val: LifecycleCallback, ctx: ClassMethodDecoratorContext<T>): void {
    let hooks = createdHooks.read(ctx.metadata);

    hooks.push({ callback: val, condition });
  };
}

export function collectHooks(
  metadata: DecoratorMetadataObject | null,
  map: WeakMap<object, LifecycleMethod<any>[]>,
): LifecycleMethod<any>[] {
  const allHooks: LifecycleMethod<any>[] = [];
  let currentMeta: object | null = metadata;

  while (currentMeta) {
    const hooks = map.get(currentMeta);

    if (hooks) {
      allHooks.unshift(...hooks);
    }

    // if the current metadata key has a prototype check it for hooks
    currentMeta = Object.getPrototypeOf(currentMeta);
  }

  return allHooks;
}

export function callLifecycle(
  instance: object,
  injector: Injector,
  metadata: DecoratorMetadataObject | null,
  hookType: "injected" | "created",
): void {
  if (!metadata) {
    return void 0;
  }

  const map = hookType === "injected" ? injectedHooks : createdHooks;
  const methods = collectHooks(metadata, map);

  for (const { callback, condition } of methods) {
    if (condition) {
      const result = condition({ injector, instance });

      if (result.enabled === false) {
        continue;
      }
    }

    if (callback) {
      callback.call(instance, injector);
    }
  }
}
