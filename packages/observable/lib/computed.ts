import { effect } from './effect.js';

export class ComputedValue<T> {
  constructor(public value: T) {}
  detach() {}
}

export function computed<T>(fn: () => T) {
  const computed = new ComputedValue<T>(fn());

  computed.detach = effect(() => {
    computed.value = fn();
  });

  return computed;
}
