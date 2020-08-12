import { PropChange } from './lifecycle';
import { PropChangeBase } from './element';

export interface PropValidationError {
  message?: string;
}

export type PropValidator = (val: any) => null | PropValidationError;

function createValidator(validator: PropValidator, key: string) {
  return function (val: any) {
    const res = validator(val);

    if (res !== null) {
      throw new Error(
        `Validation failed when assigning ${val} to key ${key}.${
          res.message ? ' ' + res.message : ''
        }`
      );
    }
  };
}

export function property(...validatorFns: PropValidator[]) {
  return function (target: PropChangeBase, key: string) {
    const valueKey = `__prop__${key}__value`;
    const initKey = `__prop__${key}__initialized`;
    const validators = validatorFns.map((v) => createValidator(v, key));

    const descriptor: PropertyDescriptor = {
      set(this: PropChangeBase & { [key: string]: any }, val) {
        for (let i = 0; i < validators.length; i++) {
          validators[i](val);
        }

        const oldValue = this[key];

        if (val !== oldValue) {
          this[valueKey] = val;

          this.queuePropChange(new PropChange(key, val, !this[initKey], oldValue));
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
