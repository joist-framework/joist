import { ConstructableToken } from './provider.js';

export interface InjectableMetadata {
  onCreated?: Function[];
  onInjected?: Function[];
}

export function readMetadata<T>(target: ConstructableToken<T>) {
  const metadata: InjectableMetadata | null = target[Symbol.metadata];

  return metadata;
}
