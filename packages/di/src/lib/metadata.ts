import { INJECTOR, type Injector } from "./injector.js";
import type { InjectionToken } from "./provider.js";

export type LifecycleCallback = (i: Injector) => void;

export interface InjectableMetadata {
  onCreated?: LifecycleCallback[];
  onInjected?: LifecycleCallback[];
}

export function readMetadata<T>(
  target: InjectionToken<T>,
): InjectableMetadata | null {
  const metadata: InjectableMetadata | null = target[Symbol.metadata];

  return metadata;
}

export function readInjector<T extends object>(target: T): Injector | null {
  if (INJECTOR in target) {
    const injector = target[INJECTOR];

    if (injector) {
      return injector as Injector;
    }

    return null;
  }

  return null;
}
