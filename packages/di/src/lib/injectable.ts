import { ConstructableToken } from './provider.js';
import { Injector } from './injector.js';

export class InjectableMap {
  #injectables = new WeakMap<object, Injector>();

  set(key: object, injector: Injector) {
    return this.#injectables.set(key, injector);
  }

  get(key: object) {
    return this.#injectables.get(key);
  }
}

export const INJECTABLE_MAP = new InjectableMap();

export function injectable<T extends ConstructableToken<any>>(Base: T, _?: unknown) {
  return class InjectableNode extends Base {
    constructor(..._: any[]) {
      super();

      INJECTABLE_MAP.set(this, new Injector(Base.providers));
    }
  };
}
