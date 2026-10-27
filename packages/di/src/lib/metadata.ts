(Symbol as any).metadata ??= Symbol("Symbol.metadata");

import { INJECTOR, SENTINAL } from "./symbols.js";
import { type Injector } from "./injector.js";

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

export class MetadataStore extends WeakMap<DecoratorMetadataObject, InjectableMetadata> {
  read(key: DecoratorMetadataObject | null) {
    if (!key) {
      return null;
    }

    const metadata = this.get(key);

    if (metadata) {
      return metadata;
    }

    const newMetadata: InjectableMetadata = {
      service: true,
    };

    this.set(key, newMetadata);

    return newMetadata;
  }
}

export const creationContextMap = new CreationContextMap();
export const injectableMetadata = new MetadataStore();

export interface CreationContext {
  sentinal: typeof SENTINAL;
  injector: Injector;
}

export interface InjectableMetadata {
  service?: boolean | undefined;
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
