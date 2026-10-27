import type { Injector } from "./injector.js";

export type LifecycleCallback = (i: Injector) => void;

export type LifecycleCondition<T> = (ctx: { injector: Injector; instance: T }) => {
  enabled?: boolean | undefined;
};

export interface LifecycleMethod<T> {
  callback?: LifecycleCallback | undefined;
  condition?: LifecycleCondition<T> | undefined;
}

const injectedHooks = new WeakMap<object, LifecycleMethod<any>[]>();
const createdHooks = new WeakMap<object, LifecycleMethod<any>[]>();

export function injected<T>(condition?: LifecycleCondition<T>) {
  return function (val: LifecycleCallback, ctx: ClassMethodDecoratorContext<T>): void {
    let hooks = injectedHooks.get(ctx.metadata);

    if (!hooks) {
      hooks = [];
      injectedHooks.set(ctx.metadata, hooks);
    }

    hooks.push({ callback: val, condition });
  };
}

export function created<T>(condition?: LifecycleCondition<T>) {
  return function (val: LifecycleCallback, ctx: ClassMethodDecoratorContext<T>): void {
    let hooks = createdHooks.get(ctx.metadata);

    if (!hooks) {
      hooks = [];
      createdHooks.set(ctx.metadata, hooks);
    }

    hooks.push({ callback: val, condition });
  };
}

export function collectHooks(
  metadata: object,
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
