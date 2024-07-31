export interface ShadowResult {
  run(root: ShadowRoot): void;
}

export abstract class JoistShadowResult implements ShadowResult {
  strings;
  values;

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

  run(root: ShadowRoot) {
    this.#shadow = root;

    this.setup(root);
  }

  abstract setup(root: ShadowRoot): void;
}
