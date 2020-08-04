import { PropChange } from './lifecycle';

export interface PropEValidationError {
  message?: string;
}

export type PropValidator = (val: any) => null | PropEValidationError;

export function property(...validators: PropValidator[]) {
  return function (target: any, key: string) {
    const valueKey = `__prop__${key}__value`;
    const initKey = `__prop__${key}__initialized`;

    Object.defineProperty(target, key, {
      set(val) {
        if (validators.length) {
          validators.forEach((validator) => {
            const res = validator(val);
            if (res !== null) {
              throw new Error(
                `Validation failed when assigning ${val} to key ${key}.${
                  res.message ? ' ' + res.message : ''
                }`
              );
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
