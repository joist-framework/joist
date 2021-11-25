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

export interface ObservableBase {
  propChanges: PropChanges;
  propChange: Promise<void> | null;
  definePropChange(propChange: PropChange): Promise<void>;
}

const PROPERTY_KEY = 'properties';

export function observe() {
  return function (target: any, key: string) {
    target[PROPERTY_KEY] = target[PROPERTY_KEY] || {};
    target[PROPERTY_KEY][key] = {};
  };
}

export function observable() {
  return <T extends new (...args: any[]) => OnChange>(CustomElement: T) => {
    const defs = readPropertyDefs(CustomElement);

    const props: Record<string, PropertyDescriptor> = {};

    for (let def in defs) {
      const privateKey = createPrivateKey(def);

      props[def] = {
        set(this: ObservableBase, val) {
          const prevVal = Reflect.get(this, privateKey);

          this.definePropChange(new PropChange(def, val, prevVal));

          Reflect.set(this, privateKey, val);
        },
        get() {
          return Reflect.get(this, privateKey);
        },
      };
    }

    return class ObservableElement extends CustomElement implements OnChange, ObservableBase {
      propChanges: PropChanges = {};
      propChange: Promise<void> | null = null;

      constructor(...args: any[]) {
        super(...args);

        for (let def in defs) {
          Reflect.set(this, createPrivateKey(def), Reflect.get(this, def));

          Object.defineProperties(this, props);
        }
      }

      onChange(e: PropChanges) {
        if (!!super.onChange) {
          super.onChange(e);
        }
      }

      definePropChange(propChange: PropChange): Promise<void> {
        this.propChanges[propChange.key] = propChange;

        if (!this.propChange) {
          // If there is no previous change defined set it up
          this.propChange = Promise.resolve().then(() => {
            // run onPropChanges here. This makes sure we capture all changes

            this.onChange(this.propChanges);

            // reset for next time
            this.propChanges = {};
            this.propChange = null;
          });
        }

        return this.propChange;
      }
    };
  };
}

function createPrivateKey(key: string) {
  return `__${key}`;
}
