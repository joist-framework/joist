import { PropChange } from './lifecycle';

export type PropValidator = (val: any) => boolean;

export function property(...validators: PropValidator[]) {
  return function (target: any, key: string) {
    const valueKey = `__prop__${key}__value`;
    const initKey = `__prop__${key}__initialized`;

    Object.defineProperty(target, key, {
      set(val) {
        if (validators.length) {
          validators.forEach((validator) => {
            if (!validator(val)) {
              throw new Error(`Validation failed when assigning ${val} to key ${key}`);
            }
          });
        }

        if (this.onPropChanges) {
          const oldValue = this[key];

          if (val !== oldValue) {
            this[valueKey] = val;

            this.onPropChanges(new PropChange(key, val, !this[initKey], oldValue));
          }
        }

        this[initKey] = true;
      },
      get() {
        return this[valueKey];
      },
    });
  };
}
