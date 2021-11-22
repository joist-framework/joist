import { PropChangeBase, PropChange } from '../lib/property';

export interface PropValidationError {
  message?: string;
}

export type PropValidator = (val: any) => null | PropValidationError;

export function definePropChange<T extends PropChangeBase>(i: T, key: keyof T, val: any) {
  const valueKey = `__joist__prop__${key}__value` as keyof T;

  const oldValue = i[key];

  if (val !== oldValue) {
    i[valueKey] = val;

    i.definePropChange(new PropChange(key as string, val, oldValue));
  }
}

export function property() {
  return function (target: PropChangeBase, key: string) {
    const valueKey = `__prop__${key}__value`;

    const descriptor: PropertyDescriptor = {
      set(this: PropChangeBase & { [key: string]: any }, val) {
        definePropChange(this, key, val);
      },
      get(this: PropChangeBase & { [key: string]: any }) {
        return this[valueKey];
      },
      configurable: true,
      enumerable: true,
    };

    Object.defineProperty(target, key, descriptor);
  };
}
