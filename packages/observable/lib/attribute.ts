export function getObservableAttributes(c: typeof HTMLElement): Array<string> {
  return Reflect.get(c, 'observedAttributes') || [];
}

function defaultRead(val: string) {
  // if a boolean assume such
  if (val === 'true' || val === 'false') {
    return val === 'true';
  }

  return val;
}

export function getAttributeParsers<T extends typeof HTMLElement>(
  c: T
): Record<string, AttributeParser> {
  const parsers: Record<string, AttributeParser> = Reflect.get(c, 'attributeParsers') || {};

  return parsers;
}

export interface AttributeParser {
  read(val: string): any;
  write(val: unknown): string;
}

export function attr<T extends HTMLElement>(
  targetOrParser: T | Partial<AttributeParser>,
  key?: string
): any {
  if (targetOrParser instanceof HTMLElement) {
    defineAttribute(targetOrParser, key as string);

    return void 0;
  }

  return (target: T, key: string) => {
    const parser = targetOrParser as AttributeParser;

    defineAttribute(target, key);

    const attributeParsers: Record<string, AttributeParser> = Reflect.get(
      target.constructor,
      'attributeParsers'
    );

    attributeParsers[key].read = parser.read || attributeParsers[key].read;
    attributeParsers[key].write = parser.write || attributeParsers[key].write;

    Reflect.set(target.constructor, 'attributeParsers', attributeParsers);

    return void 0;
  };
}

function defineAttribute<T extends HTMLElement>(target: T, key: string) {
  const observedAttributes = Reflect.get(target.constructor, 'observedAttributes') || [];
  observedAttributes.push(key);

  Reflect.set(target.constructor, 'observedAttributes', observedAttributes);

  const attributeParsers: Record<string, AttributeParser> | undefined = Reflect.get(
    target.constructor,
    'attributeParsers'
  );

  if (attributeParsers) {
    attributeParsers[key] = { read: defaultRead, write: String };
  } else {
    const attributeParsers = Reflect.get(target.constructor, 'attributeParsers');
    attributeParsers[key as string] = { read: defaultRead, write: String };

    Reflect.set(target.constructor, 'attributeParsers', attributeParsers);
  }
}
