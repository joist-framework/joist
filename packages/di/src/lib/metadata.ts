(Symbol as any).metadata ??= Symbol("Symbol.metadata");

import { INJECTOR, type Injector } from "./injector.js";
import type { InjectionToken } from "./provider.js";

export type LifecycleCallback = (i: Injector) => void;

export type LifecycleCondition = () => { enabled?: boolean };

export interface LifecycleMethod {
  callback: LifecycleCallback;
  condition?: LifecycleCondition;
}

export interface InjectableMetadata {
  onCreated?: LifecycleMethod[];
  onInjected?: LifecycleMethod[];
}

export function readMetadata<T>(target: InjectionToken<T>): InjectableMetadata | null {
  const metadata: InjectableMetadata | null = target[Symbol.metadata];

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
