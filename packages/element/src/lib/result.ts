export interface ShadowResult {
  run(el: HTMLElement): void;
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

  run(el: HTMLElement) {
    if (!el.shadowRoot) {
      throw new Error('ShadowResult has not been applied');
    }

    this.#shadow = el.shadowRoot;

    this.setup(this.#shadow);
  }

  abstract setup(root: ShadowRoot): void;
}
