export interface AttributeParser<T> {
  read(val: string): T;
  write(val: T): string;
}

export type AttributeParsers = Record<string, AttributeParser<unknown>>;

export function defaultParser(): AttributeParser<boolean | string> {
  return {
    read(val: string) {
      // if a boolean assume such
      if (val === 'true' || val === 'false') {
        return val === 'true';
      }

      return val;
    },
    write: String,
  };
}
