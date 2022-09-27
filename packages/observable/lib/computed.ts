import { effect, EffectOptions } from './effect.js';

export class ComputedValue<T> {
  constructor(public value: T) {}
  detach() {}
}

export function computed<T>(fn: () => T, opts: Partial<EffectOptions>) {
  const computed = new ComputedValue<T>(fn());

  computed.detach = effect(() => {
    computed.value = fn();
  }, opts);

  return computed;
}
