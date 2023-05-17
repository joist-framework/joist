import { ShadowResult } from './result.js';

type Tags = keyof HTMLElementTagNameMap;
type SVGTags = keyof SVGElementTagNameMap;
type MathTags = keyof MathMLElementTagNameMap;

export class HTMLResult extends ShadowResult {
  query<K extends Tags>(selectors: K): HTMLElementTagNameMap[K] | null;
  query<K extends SVGTags>(selectors: K): SVGElementTagNameMap[K] | null;
  query<K extends MathTags>(selectors: K): MathMLElementTagNameMap[K] | null;
  query<E extends Element = Element>(selectors: string): E | null;
  query<K extends Tags>(query: K) {
    return this.shadow.querySelector<K>(query);
  }

  queryAll<K extends Tags>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
  queryAll<K extends SVGTags>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
  queryAll<K extends MathTags>(selectors: K): NodeListOf<MathMLElementTagNameMap[K]>;
  queryAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
  queryAll<K extends Tags>(query: K) {
    return this.shadow.querySelectorAll<K>(query);
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
