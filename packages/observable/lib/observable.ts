export class Change<T = any> {
  constructor(public value: T, public previousValue: T | undefined, public firstChange: boolean) {}
}

export type Changes = Record<string | symbol, Change>;

export interface OnChange {
  onChange(changes: Changes): void;
}

export function readPropertyDefs(c: any): Record<string | symbol, {}> {
  return c.properties || c.prototype.properties || {};
}

export interface ObservableBase {
  propChanges: Changes;
  propChange: Promise<void> | null;
  initializedChanges: Set<string | symbol>;
  definePropChange(key: string | symbol, propChange: Change): Promise<void>;
}

const PROPERTY_KEY = 'properties';

export function observe() {
  return function (target: any, key: string) {
    target[PROPERTY_KEY] = target[PROPERTY_KEY] || {};
    target[PROPERTY_KEY][key] = {};
  };
}

export function observable() {
  return <T extends new (...args: any[]) => any>(CustomElement: T) => {
    const defs = readPropertyDefs(CustomElement);
    const props = createPropertyDescripors(defs);

    return class ObservableElement extends CustomElement implements ObservableBase {
      propChanges: Changes = {};
      propChange: Promise<void> | null = null;
      initializedChanges = new Set<string | symbol>();

      constructor(...args: any[]) {
        super(...args);

        for (let def in defs) {
          Reflect.set(this, createPrivateKey(def), Reflect.get(this, def));
        }

        Object.defineProperties(this, props);
      }

      definePropChange(key: string | symbol, propChange: Change): Promise<void> {
        if (!this.propChanges[key]) {
          this.propChanges[key] = propChange;
        }

        this.propChanges[key].value = propChange.value;

        if (!this.propChange) {
          // If there is no previous change defined set it up
          this.propChange = Promise.resolve().then(() => {
            // run onPropChanges here. This makes sure we capture all changes

            // keep track of whether or not this is the first time a given property has changes
            for (let change in this.propChanges) {
              this.propChanges[change].firstChange = !this.initializedChanges.has(change);

              this.initializedChanges.add(change);
            }

            if (this.onChange) {
              this.onChange(this.propChanges);
            }

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

function createPropertyDescripors(
  defs: Record<string | symbol, {}>
): Record<string, PropertyDescriptor> {
  const props: Record<string, PropertyDescriptor> = {};

  for (let def in defs) {
    const privateKey = createPrivateKey(def);

    props[def] = {
      set(this: ObservableBase, val) {
        const prevVal = Reflect.get(this, privateKey);

        this.definePropChange(def, new Change(val, prevVal, true));

        Reflect.set(this, privateKey, val);
      },
      get() {
        return Reflect.get(this, privateKey);
      },
    };
  }

  return props;
}
