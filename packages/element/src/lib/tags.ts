import { Result } from './result.js';

export class HTMLResult extends Result<HTMLTemplateElement> {
  createValue(str: string): HTMLTemplateElement {
    const el = document.createElement('template');
    el.innerHTML = str;

    return el;
  }
}

export function html(strings: TemplateStringsArray): HTMLResult {
  return new HTMLResult(strings);
}

export class CSSResult extends Result<CSSStyleSheet> {
  createValue(str: string): CSSStyleSheet {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(str);

    return sheet;
  }
}

export function css(strings: TemplateStringsArray): CSSResult {
  return new CSSResult(strings);
}
