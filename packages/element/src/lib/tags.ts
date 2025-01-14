import type { ShadowResult } from "./result.js";

export class HTMLResult<T extends HTMLElement> implements ShadowResult {
  #template;

  constructor(raw: TemplateStringsArray, ..._values: any[]) {
    this.#template = document.createElement("template");
    this.#template.innerHTML = concat(raw);
  }

  apply(el: T): void {
    if (el.shadowRoot) {
      el.shadowRoot.append(this.#template.content.cloneNode(true));
    }
  }
}

export function html<T extends HTMLElement>(
  strings: TemplateStringsArray,
  ...values: any[]
): HTMLResult<T> {
  return new HTMLResult(strings, ...values);
}

export class CSSResult implements ShadowResult {
  #sheet;

  constructor(raw: TemplateStringsArray, ..._values: any[]) {
    this.#sheet = new CSSStyleSheet();
    this.#sheet.replaceSync(concat(raw));
  }

  apply(el: HTMLElement): void {
    if (el.shadowRoot) {
      el.shadowRoot.adoptedStyleSheets = [
        ...el.shadowRoot.adoptedStyleSheets,
        this.#sheet,
      ];
    }
  }
}

export function css(strings: TemplateStringsArray): CSSResult {
  return new CSSResult(strings);
}

function concat(strings: TemplateStringsArray) {
  let res = "";

  for (let i = 0; i < strings.length; i++) {
    res += strings[i];
  }

  return res;
}
