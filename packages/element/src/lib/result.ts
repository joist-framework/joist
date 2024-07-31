export interface ShadowResult {
  run(el: HTMLElement): void;
}

export abstract class JoistShadowResult implements ShadowResult {
  strings;
  values;

  constructor(raw: TemplateStringsArray, ...values: any[]) {
    this.strings = raw;
    this.values = values;
  }

  run(el: HTMLElement) {
    if (!el.shadowRoot) {
      throw new Error('ShadowResult has not been applied');
    }

    this.setup(el.shadowRoot);
  }

  abstract setup(root: ShadowRoot): void;
}
