(Symbol as any).metadata ??= Symbol("Symbol.metadata");

import { INJECTOR, SENTINAL } from "./symbols.js";
import { type Injector } from "./injector.js";
import type { InjectionToken } from "./provider.js";

export interface CreationContext {
  sentinel: typeof SENTINAL;
  injector: Injector;
}

export function isCreationContext(value: unknown): value is CreationContext {
  return (
    typeof value === "object" &&
    value !== null &&
    "sentinel" in value &&
    value.sentinel === SENTINAL
  );
}

export type LifecycleCallback = (i: Injector) => void;

export type LifecycleCondition<T> = (ctx: { injector: Injector; instance: T }) => {
  enabled?: boolean | undefined;
};

export interface LifecycleMethod<T> {
  callback?: LifecycleCallback | undefined;
  condition?: LifecycleCondition<T> | undefined;
}

export interface InjectableMetadata<T> {
  service?: boolean | undefined;
  onCreated?: LifecycleMethod<T>[] | undefined;
  onInjected?: LifecycleMethod<T>[] | undefined;
}

export function readMetadata<T>(target: InjectionToken<T>): InjectableMetadata<T> | null {
  const metadata: InjectableMetadata<T> | null = target[Symbol.metadata];

  return metadata;
}

function isInjectable(target: unknown): target is { [INJECTOR]: Injector } {
  if (typeof target === "object" && target !== null) {
    return INJECTOR in target;
  }

  return false;
}

export function readInjector<T>(target: T): Injector | null {
  if (isInjectable(target)) {
    return target[INJECTOR];
  }

  return null;
}
