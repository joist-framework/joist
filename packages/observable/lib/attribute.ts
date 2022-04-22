import {
  AttributeParser,
  AttributeParsers,
  defaultParser,
  propNameToAttrName,
} from './attribute-parsers';

export function getObservableAttributes(c: typeof HTMLElement): Array<string> {
  const attrs: string[] = Reflect.get(c, 'observedAttributes') || [];

  return attrs.map(propNameToAttrName);
}

export function getAttributeParsers<T extends typeof HTMLElement>(
  c: T
): Record<string, AttributeParser<unknown>> {
  const parsers: AttributeParsers = Reflect.get(c, 'attributeParsers') || {};

  return parsers;
}

export function attr<T extends HTMLElement>(
  p: Partial<AttributeParser<unknown>>
): (t: T, key: string) => void;
export function attr<T extends HTMLElement>(t: T, key: string): void;
export function attr<T extends HTMLElement>(targetOrParser: unknown, key?: string): any {
  if (targetOrParser instanceof HTMLElement) {
    const attrName = propNameToAttrName(key as string);

    return defineAttribute(targetOrParser, attrName, key as string);
  }

  return (target: T, key: string) => {
    const parser = targetOrParser as AttributeParser<unknown>;
    const attrName = propNameToAttrName(key);

    defineAttribute(target, attrName, key);

    const attributeParsers: AttributeParsers = Reflect.get(target.constructor, 'attributeParsers');

    attributeParsers[attrName].read = parser.read || attributeParsers[attrName].read;
    attributeParsers[attrName].write = parser.write || attributeParsers[attrName].write;

    Reflect.set(target.constructor, 'attributeParsers', attributeParsers);

    return void 0;
  };
}

function defineAttribute<T extends HTMLElement>(
  target: T,
  attrName: string,
  propName: string
): void {
  const observedAttributes: string[] | undefined = Reflect.get(
    target.constructor,
    'observedAttributes'
  );

  if (observedAttributes) {
    observedAttributes.push(attrName);
  } else {
    Reflect.set(target.constructor, 'observedAttributes', [attrName]);
  }

  const attributeParsers: AttributeParsers | undefined = Reflect.get(
    target.constructor,
    'attributeParsers'
  );

  if (attributeParsers) {
    attributeParsers[attrName] = defaultParser(propName);
  } else {
    Reflect.set(target.constructor, 'attributeParsers', { [attrName]: defaultParser(propName) });
  }

  return void 0;
}
