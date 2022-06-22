// This is super stolen from stuff in LIT. All I want to do is provide safety

const constructionToken = Symbol();

export class CSSResult {
  readonly cssText: string;

  constructor(cssText: string, safeToken: symbol) {
    if (safeToken !== constructionToken) {
      throw new Error('CSSResult is not constructable. Use `css` instead.');
    }

    this.cssText = cssText;
  }

  toString(): string {
    return this.cssText;
  }
}

export function css(strings: TemplateStringsArray, ...values: CSSResult[]) {
  const cssText = values.reduce(
    (acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1],
    strings[0]
  );

  return new CSSResult(cssText, constructionToken);
}

const textFromCSSResult = (value: CSSResult) => {
  if (!(value instanceof CSSResult)) {
    throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}`);
  }

  return value.cssText;
};
