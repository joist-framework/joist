(Symbol as any).metadata ??= Symbol("Symbol.metadata");

import { INJECTOR, type Injector } from "./injector.js";
import type { InjectionToken } from "./provider.js";

export type LifecycleCallback = (i: Injector) => void;

export type LifecycleCondition<T> = (ctx:{injector: Injector, instance: T}) => { enabled?: boolean };

export interface LifecycleMethod<T> {
  callback: LifecycleCallback;
  condition?: LifecycleCondition<T>;
}

export interface InjectableMetadata<T> {
  onCreated?: LifecycleMethod<T>[];
  onInjected?: LifecycleMethod<T>[];
}

export function readMetadata<T>(target: InjectionToken<T>): InjectableMetadata<T> | null {
  const metadata: InjectableMetadata<T> | null = target[Symbol.metadata];

  return metadata;
}

export function readInjector<T>(target: T): Injector | null {
  if (typeof target === "object" && target !== null) {
    if (INJECTOR in target) {
      return target[INJECTOR] as Injector;
    }
  }

  return null;
}
