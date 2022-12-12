export class Result<T> {
  #raw: TemplateStringsArray;
  #stringRes: string | null = null;
  #valueRes: T | null = null;
  #toVal: (str: string) => T;

  constructor(raw: TemplateStringsArray, toVal: (str: string) => T) {
    this.#raw = raw;
    this.#toVal = toVal;
  }

  toString(): string {
    if (!this.#stringRes) {
      this.#stringRes = this.#raw.toString();
    }

    return this.#stringRes;
  }

  toValue(): T {
    if (!this.#valueRes) {
      this.#valueRes = this.#toVal(this.toString());
    }

    return this.#valueRes;
  }
}
