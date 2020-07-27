import { PropChange } from './lifecycle';

export function property() {
  return function (target: any, key: string) {
    const valueKey = `__prop__${key}__value`;
    const initKey = `__prop__${key}__initialized`;

    Object.defineProperty(target, key, {
      set(val) {
        if (this.onPropChanges) {
          const oldValue = this[key];

          this[valueKey] = val;

          this.onPropChanges(new PropChange(key, val, !this[initKey], oldValue));
        }

        this[initKey] = true;
      },
      get() {
        return this[valueKey];
      },
    });
  };
}
