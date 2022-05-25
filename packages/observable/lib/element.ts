import { Changes } from './observable';
import { getAttributeParsers, getObservableAttributes } from './attribute';
import { propNameToAttrName } from './attribute-parsers';

export class ObservableElement extends HTMLElement {
  __upgradedProps = new Map<keyof this, unknown>();

  constructor() {
    super();

    for (let prop in this) {
      if (this.hasOwnProperty(prop) && prop !== 'upgradedProps') {
        this.__upgradedProps.set(prop, this[prop]);
      }
    }
  }

  connectedCallback() {
    const attributes = getObservableAttributes(this.constructor);
    const parsers = getAttributeParsers(this.constructor);

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

  attributeChangedCallback(name: string, _: string, newVal: string) {
    const parsers = getAttributeParsers(this.constructor);

    const { read, mapTo } = parsers[name];

    Reflect.set(this, mapTo, read(newVal));
  }

  onPropertyChanged(changes: Changes) {
    const attributes = getObservableAttributes(this.constructor);
    const parsers = getAttributeParsers(this.constructor);

    if (this instanceof ObservableElement) {
      for (let change in changes) {
        const attrName = propNameToAttrName(change);

        if (attributes.includes(attrName)) {
          const value = parsers[attrName].write(changes[change].value);

          if (value !== this.getAttribute(attrName)) {
            this.setAttribute(attrName, value);
          }
        }
      }
    }
  }
}
