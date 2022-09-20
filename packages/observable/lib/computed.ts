import { effect } from './effect.js';

export class ComputedValue<T> {
  constructor(public value: T) {}
  remove() {}
}

export function computed<T>(fn: () => T) {
  const computed = new ComputedValue<T>(fn());

  computed.remove = effect(() => {
    computed.value = fn();
  });

  return computed;
}
