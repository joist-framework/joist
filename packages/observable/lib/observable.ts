export class Change<T = any> {
  constructor(public value: T, public previousValue: T | undefined, public firstChange: boolean) {}
}

export type Changes = Record<string | symbol, Change>;

export interface OnChange {
  onChange(changes: Changes): void;
}

const PROPERTY_KEY = 'props';

export function readPropertyDefs(c: any): Array<string | symbol> {
  return c[PROPERTY_KEY] || {};
}

export interface ObservableBase {
  propChanges: Changes;
  propChange: Promise<void> | null;
  initializedChanges: Set<string | symbol>;
  onChange?: (changes: Changes) => void;
  definePropChange(key: string | symbol, propChange: Change): Promise<void>;
}

export function observe(target: any, key: string) {
  target.constructor[PROPERTY_KEY] = target.constructor[PROPERTY_KEY] || [];
  target.constructor[PROPERTY_KEY].push(key);
}

export function observable<T extends new (...args: any[]) => any>(Base: T) {
  const props = readPropertyDefs(Base);
  const descriptors = createPropertyDescripors(props);

  return class Observable extends Base implements ObservableBase {
    propChanges: Changes = {};
    propChange: Promise<void> | null = null;
    initializedChanges = new Set<string | symbol>();

    constructor(...args: any[]) {
      super(...args);

      for (let i = 0; i < props.length; i++) {
        const prop = props[i];

        Reflect.set(this, createPrivateKey(prop), Reflect.get(this, prop));
      }

      Object.defineProperties(this, descriptors);
    }

    definePropChange = definePropChange;
  };
}

function createPrivateKey(key: string | symbol) {
  return `__${key.toString()}`;
}

function createPropertyDescripors(
  props: Array<string | symbol>
): Record<string, PropertyDescriptor> {
  const descriptors: Record<string | symbol, PropertyDescriptor> = {};

  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    const privateKey = createPrivateKey(prop);

    descriptors[prop] = {
      set(this: ObservableBase, val) {
        const prevVal = Reflect.get(this, privateKey);

        if (prevVal !== val) {
          this.definePropChange(prop, new Change(val, prevVal, true));
        }

        return Reflect.set(this, privateKey, val);
      },
      get() {
        return Reflect.get(this, privateKey);
      },
    };
  }

  return descriptors;
}

function definePropChange(
  this: ObservableBase,
  key: string | symbol,
  propChange: Change
): Promise<void> {
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
