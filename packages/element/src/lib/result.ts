export abstract class ShadowResult {
  strings: TemplateStringsArray;
  values: any[];

  #shadow: ShadowRoot | undefined = undefined;

  get shadow() {
    if (!this.#shadow) {
      throw new Error('ShadowResult has not been applied');
    }

    return this.#shadow;
  }

  constructor(raw: TemplateStringsArray, ...values: any[]) {
    this.strings = raw;
    this.values = values;
  }

  execute(root: ShadowRoot) {
    this.#shadow = root;

    this.apply(root);
  }

  abstract apply(root: ShadowRoot): void;
}
