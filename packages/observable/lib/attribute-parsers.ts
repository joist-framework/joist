export interface AttributeParser<T> {
  read(val: string): T;
  write(val: T): string;
}

export type AttributeParsers = Record<string, AttributeParser<unknown>>;

export const number: AttributeParser<number> = {
  read: Number,
  write: String,
};

export const date: AttributeParser<Date> = {
  read: (val) => new Date(val),
  write: String,
};

export const json: AttributeParser<Object> = {
  read: JSON.parse,
  write: JSON.stringify,
};

export const bool: AttributeParser<boolean> = {
  read: (val) => val === 'true',
  write: String,
};

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
