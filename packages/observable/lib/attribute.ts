import { AttributeParser, AttributeParsers, defaultParser } from './attribute-parsers';

export function getObservableAttributes(c: typeof HTMLElement): Array<string> {
  return Reflect.get(c, 'observedAttributes') || [];
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
    return defineAttribute(targetOrParser, key as string);
  }

  return (target: T, key: string) => {
    const parser = targetOrParser as AttributeParser<unknown>;

    defineAttribute(target, key);

    const attributeParsers: AttributeParsers = Reflect.get(target.constructor, 'attributeParsers');

    attributeParsers[key].read = parser.read || attributeParsers[key].read;
    attributeParsers[key].write = parser.write || attributeParsers[key].write;

    Reflect.set(target.constructor, 'attributeParsers', attributeParsers);

    return void 0;
  };
}

function defineAttribute<T extends HTMLElement>(target: T, key: string): void {
  const observedAttributes: string[] | undefined = Reflect.get(
    target.constructor,
    'observedAttributes'
  );

  if (observedAttributes) {
    observedAttributes.push(key);
  } else {
    Reflect.set(target.constructor, 'observedAttributes', [key]);
  }

  const attributeParsers: AttributeParsers | undefined = Reflect.get(
    target.constructor,
    'attributeParsers'
  );

  if (attributeParsers) {
    attributeParsers[key] = defaultParser();
  } else {
    Reflect.set(target.constructor, 'attributeParsers', { [key]: defaultParser() });
  }

  return void 0;
}
