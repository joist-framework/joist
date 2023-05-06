import { effect } from './effect.js';

class ComputedValue<T> {
  get value() {
    return this.#value;
  }

  detach = effect(() => {
    this.#value = this.#cb();
  });

  #cb: () => T;
  #value: T;

  constructor(cb: () => T) {
    this.#cb = cb;
    this.#value = this.#cb();
  }
}

export function computed<T>(cb: () => T) {
  return new ComputedValue(cb);
}
