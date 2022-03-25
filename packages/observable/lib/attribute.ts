const PROPERTY_KEY = 'observedAttributes';

export function getObservableAttributes(c: typeof HTMLElement): Array<string> {
  return Reflect.get(c, PROPERTY_KEY) || [];
}

export function attr(target: any, key: string) {
  target.constructor[PROPERTY_KEY] = target.constructor[PROPERTY_KEY] || [];
  target.constructor[PROPERTY_KEY].push(key);
}

export interface AttributeParser {
  fromAttribute?(name: string, value: string): any;
}
