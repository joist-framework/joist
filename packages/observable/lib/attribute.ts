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

export function attr(target: any, key: string) {
  target.constructor.observedAttributes = target.constructor.observedAttributes || [];
  target.constructor.observedAttributes.push(key);

  target.constructor.attributeParsers = target.constructor.attributeParsers || {};
  target.constructor.attributeParsers[key] = {
    read: defaultRead,
    write: String,
  };
}

export function attribute(parser: Partial<AttributeParser>) {
  return (target: any, key: string) => {
    attr(target, key);

    const current: AttributeParser = target.constructor.attributeParsers[key];

    current.read = parser.read || current.read;
    current.write = parser.write || current.write;
  };
}
