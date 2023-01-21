import { Result } from './result.js';

export class HTMLResult extends Result<HTMLTemplateElement> {
  toVal(str: string): HTMLTemplateElement {
    const el = document.createElement('template');
    el.innerHTML = str;

    return el;
  }
}

export function html(strings: TemplateStringsArray): HTMLResult {
  return new HTMLResult(strings);
}

export class CSSResult extends Result<CSSStyleSheet | HTMLStyleElement> {
  toVal(str: string): CSSStyleSheet | HTMLStyleElement {
    if (document.adoptedStyleSheets) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(str);

      return sheet;
    }

    const style = document.createElement('style');
    style.innerHTML = str;

    return style;
  }
}

export function css(strings: TemplateStringsArray): CSSResult {
  return new CSSResult(strings);
}
