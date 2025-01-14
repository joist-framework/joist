(Symbol as any).metadata ??= Symbol('Symbol.metadata');

import { Injector } from './injector.js';
import { InjectionToken } from './provider.js';

export type LifecycleCallback = (i: Injector) => void;

export interface InjectableMetadata {
  onCreated?: Set<LifecycleCallback>;
  onInjected?: Set<LifecycleCallback>;
}

export function readMetadata<T>(target: InjectionToken<T>): InjectableMetadata | null {
  const metadata: InjectableMetadata | null = target[Symbol.metadata];

  return metadata;
}
