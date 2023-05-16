import { TemplateResult } from './result.js';

export class HTMLResult extends TemplateResult {
  apply(root: ShadowRoot): void {
    const el = document.createElement('template');
    el.innerHTML = this.strings.join(',');

    root.append(el.content.cloneNode(true));
  }
}

export function html(strings: TemplateStringsArray): HTMLResult {
  return new HTMLResult(strings);
}

export class CSSResult extends TemplateResult {
  apply(root: ShadowRoot): void {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(this.strings.join(''));

    root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
  }
}

export function css(strings: TemplateStringsArray): CSSResult {
  return new CSSResult(strings);
}
