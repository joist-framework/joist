export abstract class Result<T> {
  #raw: TemplateStringsArray;
  #stringRes: string | null = null;
  #valueRes: T | null = null;

  constructor(raw: TemplateStringsArray) {
    this.#raw = raw;
  }

  toString(): string {
    if (!this.#stringRes) {
      this.#stringRes = this.#raw.toString();
    }

    return this.#stringRes;
  }

  toValue(): T {
    if (!this.#valueRes) {
      this.#valueRes = this.createValue(this.toString());
    }

    return this.#valueRes;
  }

  abstract createValue(str: string): T;
}