import { getAttributeParsers, getObservableAttributes } from './attribute.js';
import { AttributeParsers, propNameToAttrName } from './attribute-parsers.js';

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

export class JoistChangeEvent extends Event {
  constructor(public changes: Changes) {
    super('joist-observable-change', { bubbles: true });
  }
}

export interface ObservableBase {
  propChanges: Map<string | symbol, Change>;
  scheduler: Promise<void> | null;
  initializedChanges: Set<string | symbol>;

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
  const parsers = getAttributeParsers(Base);
  const attributes = getObservableAttributes(Base);

  return class Observable extends Base implements ObservableBase {
    propChanges = new Map();
    scheduler: Promise<void> | null = null;
    initializedChanges = new Set<string | symbol>();

    constructor(...args: any[]) {
      super(...args);

      init.call(this, descriptors);
    }

    connectedCallback(this: HTMLElement) {
      connectedCallback.call(this, attributes, parsers);

      if (super.connectedCallback) {
        super.connectedCallback();
      }
    }

    attributeChangedCallback(this: HTMLElement, name: string, oldVal: string, newVal: string) {
      attributeChangedCallback.call(this, name, newVal, parsers);

      if (super.attributeChangedCallback) {
        super.attributeChangedCallback(name, oldVal, newVal);
      }
    }

    onPropertyChanged(changes: Changes) {
      onPropertyChanged.call(this, attributes, parsers, changes);

      if (super.onPropertyChanged) {
        super.onPropertyChanged(changes);
      }
    }

    definePropChange(key: string | symbol, propChange: Change): Promise<void> {
      return definePropChange.call(this, key, propChange);
    }
  };
}

function init(this: Record<string, unknown>, descriptors: Record<string, PropertyDescriptor>) {
  for (let prop in descriptors) {
    Object.defineProperty(this, createPrivateKey(prop), {
      value: Reflect.get(this, prop),
      enumerable: false,
      writable: true,
    });
  }

  Object.defineProperties(this, descriptors);

  // Set initial props if ForwardPropsed from ObservableElement
  if ('__upgradedProps' in this && this['__upgradedProps'] instanceof Map) {
    for (let [key, value] of this.__upgradedProps) {
      Reflect.set(this, key, value);
    }
  }
}

function connectedCallback(this: HTMLElement, attributes: string[], parsers: AttributeParsers) {
  for (let i = 0; i < attributes.length; i++) {
    const key = attributes[i];
    const { write, mapTo } = parsers[key];

    if (this.getAttribute(key) === null) {
      const propVal = Reflect.get(this, mapTo);

      if (propVal !== undefined && propVal !== null && propVal !== '') {
        this.setAttribute(key, write(propVal));
      }
    }
  }
}

function attributeChangedCallback(
  this: HTMLElement,
  name: string,
  newVal: string,
  parsers: AttributeParsers
) {
  const { read, mapTo } = parsers[name];

  Reflect.set(this, mapTo, read(newVal));
}

function onPropertyChanged(
  this: unknown,
  attributes: string[],
  parsers: AttributeParsers,
  changes: Changes
) {
  if (this instanceof HTMLElement) {
    for (let change in changes) {
      const attrName = propNameToAttrName(change);

      if (attributes.includes(attrName)) {
        const value = parsers[attrName].write(changes[change].value);

        if (value !== this.getAttribute(attrName)) {
          this.setAttribute(attrName, value);
        }
      }
    }

    this.dispatchEvent(new JoistChangeEvent(changes));
  } else {
    window.dispatchEvent(new JoistChangeEvent(changes));
  }
}

function definePropChange(
  this: ObservableBase,
  key: string | symbol,
  propChange: Change
): Promise<void> {
  if (!this.propChanges.has(key)) {
    this.propChanges.set(key, propChange);
  }

  this.propChanges.get(key)!.value = propChange.value;

  if (!this.scheduler) {
    // If there is no previous change defined set it up
    this.scheduler = Promise.resolve().then(() => {
      // run onPropChanges here. This makes sure we capture all changes
      const changes: Changes = {};

      // Copy changes and keep track of whether or not this is the first time a given property has changes
      for (let [key, value] of this.propChanges) {
        changes[key] = value;

        changes[key].firstChange = !this.initializedChanges.has(key);

        this.initializedChanges.add(key);
      }

      // clear out before calling to account for changes made INSIDE of the onPropertyChanged callback
      this.scheduler = null;
      this.propChanges.clear();

      if (this.onPropertyChanged) {
        this.onPropertyChanged(changes);
      }
    });
  }

  return this.scheduler;
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
