import { PropChange } from './lifecycle';
import { PropChangeBase } from './element';

export function property() {
  return function (target: PropChangeBase, key: string) {
    const valueKey = `__prop__${key}__value`;
    const initKey = `__prop__${key}__initialized`;

    const descriptor: PropertyDescriptor = {
      set(this: PropChangeBase & { [key: string]: any }, val) {
        const oldValue = this[key];

        if (val !== oldValue) {
          this[valueKey] = val;

          this.definePropChange(new PropChange(key, val, !this[initKey], oldValue));
        }

        this[initKey] = true;
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
