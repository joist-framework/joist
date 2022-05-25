import { ObservableElement } from './element';

export class Change<T = any> {
  constructor(public value: T, public previousValue: T | undefined, public firstChange: boolean) {}
}

export type Changes = Record<string | symbol, Change>;

export interface OnPropertyChanged {
  onPropertyChanged(changes: Changes): void;
}

const PROPERTY_KEY = 'observedProperties';

export function getObservableProperties(c: any): Array<string | symbol> {
  return c[PROPERTY_KEY] || [];
}

export interface ObservableBase {
  __propChanges: Map<string | symbol, Change>;
  __propChange: Promise<void> | null;
  __initializedChanges: Set<string | symbol>;

  definePropChange(key: string | symbol, propChange: Change): Promise<void>;
  onPropertyChanged?(changes: Changes): void;
}

export function observe(target: any, key: string) {
  target.constructor[PROPERTY_KEY] = target.constructor[PROPERTY_KEY] || [];
  target.constructor[PROPERTY_KEY].push(key);
}

export function observable<T extends new (...args: any[]) => any>(Base: T) {
  const properties = getObservableProperties(Base);
  const descriptors = createPropertyDescripors(properties);

  return class Observable extends Base implements ObservableBase {
    __propChanges = new Map();
    __propChange: Promise<void> | null = null;
    __initializedChanges = new Set<string | symbol>();

    constructor(...args: any[]) {
      super(...args);

      // Set initial props if forwarded from ObservableElement
      if (this instanceof ObservableElement) {
        for (let [key, value] of this.__upgradedProps) {
          Reflect.set(this, key, value);
        }
      }

      for (let prop in descriptors) {
        Object.defineProperty(this, createPrivateKey(prop), {
          value: Reflect.get(this, prop),
          enumerable: false,
          writable: true,
        });
      }

      Object.defineProperties(this, descriptors);
    }

    definePropChange(key: string | symbol, propChange: Change): Promise<void> {
      if (!this.__propChanges.has(key)) {
        this.__propChanges.set(key, propChange);
      }

      this.__propChanges.get(key)!.value = propChange.value;

      if (!this.__propChange) {
        // If there is no previous change defined set it up
        this.__propChange = Promise.resolve().then(() => {
          // run onPropChanges here. This makes sure we capture all changes
          const changes: Changes = {};

          // Copy changes and keep track of whether or not this is the first time a given property has changes
          for (let [key, value] of this.__propChanges) {
            changes[key] = value;

            changes[key].firstChange = !this.__initializedChanges.has(key);

            this.__initializedChanges.add(key);
          }

          // clear out before calling to account for changes made INSIDE of the onPropertyChanged callback
          this.__propChange = null;
          this.__propChanges.clear();

          this.onPropertyChanged(changes);
        });
      }

      return this.__propChange;
    }
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
