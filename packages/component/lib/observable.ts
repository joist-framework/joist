export class PropChange<T = any> {
  constructor(public key: string | symbol, public newValue: T, public oldValue?: T) {}
}

export type PropChanges = Record<string | symbol, PropChange>;

export interface OnChange {
  onChange(changes: PropChanges): void;
}

export function readPropertyDefs(c: any): Record<string | symbol, {}> {
  return c.properties || c.prototype.properties || {};
}

const PROPERTY_KEY = 'properties';

export function observe() {
  return function (target: any, key: string) {
    target[PROPERTY_KEY] = target[PROPERTY_KEY] || {};
    target[PROPERTY_KEY][key] = {};
  };
}

export function observable() {
  return <T extends new (...args: any[]) => HTMLElement>(CustomElement: T) => {
    const defs = readPropertyDefs(CustomElement);

    Object.defineProperty(CustomElement.prototype, 'propChanges', {
      value: {},
      enumerable: false,
      writable: true,
    });

    Object.defineProperty(CustomElement.prototype, 'propChange', {
      value: null,
      enumerable: false,
      writable: true,
    });

    for (let def in defs) {
      Object.defineProperty(CustomElement.prototype, def, {
        set(val: any) {
          Reflect.set(this, `__$$${def}`, val);

          definePropChange(this, new PropChange(def, val));
        },
        get() {
          return Reflect.get(this, `__$$${def}`);
        },
      });
    }

    return CustomElement;
  };
}

export interface PropChangeBase {
  propChanges: PropChanges;
  propChange: Promise<void> | null;

  onChange?: (changes: PropChanges) => void;
}

function definePropChange(base: PropChangeBase, propChange: PropChange): Promise<void> {
  base.propChanges[propChange.key] = propChange;

  if (!base.propChange) {
    // If there is no previous change defined set it up
    base.propChange = Promise.resolve().then(() => {
      // run onPropChanges here. This makes sure we capture all changes
      if (base.onChange) {
        base.onChange(base.propChanges);
      }

      // reset for next time
      base.propChanges = {};
      base.propChange = null;
    });
  }

  return base.propChange;
}
