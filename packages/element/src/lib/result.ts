export abstract class TemplateResult {
  strings: TemplateStringsArray;
  values: any[];

  constructor(raw: TemplateStringsArray, ...values: any[]) {
    this.strings = raw;
    this.values = values;
  }

  abstract apply(root: ShadowRoot): void;
}
