import type { Injector } from "./injector.js";
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
