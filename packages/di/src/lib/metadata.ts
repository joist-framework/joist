import { Injector } from './injector.js';
import { ConstructableToken } from './provider.js';

export type LifecycleCallback = (i: Injector) => void;

export interface InjectableMetadata {
  onCreated?: LifecycleCallback[];
  onInjected?: LifecycleCallback[];
}

export function readMetadata<T>(target: ConstructableToken<T>): InjectableMetadata | null {
  const metadata: InjectableMetadata | null = target[Symbol.metadata];

  return metadata;
}
