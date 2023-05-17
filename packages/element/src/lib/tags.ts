import { ShadowResult } from './result.js';

export class HTMLResult extends ShadowResult {
  query<T extends Element>(query: keyof HTMLElementTagNameMap) {
    return this.shadow.querySelector<T>(query);
  }

  queryAll<T extends Element>(query: keyof HTMLElementTagNameMap) {
    return this.shadow.querySelectorAll<T>(query);
  }

  apply(root: ShadowRoot): void {
    const el = document.createElement('template');
    el.innerHTML = this.strings.join(',');

    root.append(el.content.cloneNode(true));
  }
}

export function html(strings: TemplateStringsArray, ...values: any[]): HTMLResult {
  return new HTMLResult(strings, ...values);
}

export class CSSResult extends ShadowResult {
  append(result: CSSResult) {
    result.apply(this.shadow);
  }

  apply(root: ShadowRoot): void {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(this.strings.join(''));

    root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
  }
}

export function css(strings: TemplateStringsArray, ...values: any[]): CSSResult {
  return new CSSResult(strings, ...values);
}
