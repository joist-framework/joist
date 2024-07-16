import { Injector } from './injector.js';

export class InjectableMap {
  #injectables = new WeakMap<object, Injector>();

  get(key: object) {
    return this.#injectables.get(key);
  }

  set(key: object, injector: Injector) {
    return this.#injectables.set(key, injector);
  }
}
