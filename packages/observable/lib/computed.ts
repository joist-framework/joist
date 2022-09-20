import { effect } from './effect';
import { observable } from './observable';

export function computed<T>(fn: () => T) {
  const ComputedValue = observable(
    class ComputedValue {
      static observableProperties: string[] = ['value'];

      value = fn();
      remove() {}
    }
  );

  const computed = new ComputedValue();

  computed.remove = effect(() => {
    computed.value = fn();
  });

  return computed;
}
