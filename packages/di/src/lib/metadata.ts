(Symbol as any).metadata ??= Symbol("Symbol.metadata");

import { INJECTOR, SENTINAL } from "./symbols.js";
import { type Injector } from "./injector.js";
import type { InjectionToken } from "./provider.js";

export class CreationContextMap {
  static readonly instance = new CreationContextMap();

  #value: CreationContext | null = null;

  get() {
    return this.#value;
  }

  set(ctx: CreationContext) {
    this.#value = ctx;
  }

  clear() {
    this.#value = null;
  }
}

export const creationContextMap = new CreationContextMap();

export interface CreationContext {
  sentinal: typeof SENTINAL;
  injector: Injector;
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
