export interface AttributeParser<T> {
  read(val: string): T;
  write(val: T): string;
  mapTo: string;
}

export type AttributeParsers = Record<string, AttributeParser<unknown>>;

export function defaultParser(mapTo: string): AttributeParser<boolean | string> {
  return {
    read(val: string) {
      // if a boolean assume such
      if (val === 'true' || val === 'false') {
        return val === 'true';
      }

      return val;
    },
    write: String,
    mapTo,
  };
}

export function propNameToAttrName(prop: string) {
  return prop
    .split(/(?=[A-Z])/)
    .join('-')
    .toLowerCase();
}
