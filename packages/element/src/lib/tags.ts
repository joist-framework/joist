import { JoistShadowResult } from './result.js';

export class HTMLResult extends JoistShadowResult {
  setup(root: ShadowRoot): void {
    let template = document.createElement('template');
    template.innerHTML = concat(this.strings);

    root.append(template.content.cloneNode(true));
  }
}

export function html(strings: TemplateStringsArray, ...values: any[]): HTMLResult {
  return new HTMLResult(strings, ...values);
}

export class CSSResult extends JoistShadowResult {
  setup(root: ShadowRoot): void {
    let sheet = new CSSStyleSheet();
    sheet.replaceSync(concat(this.strings));

    root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
  }
}

export function css(strings: TemplateStringsArray): CSSResult {
  return new CSSResult(strings);
}

function concat(strings: TemplateStringsArray) {
  let res = '';

  for (let i = 0; i < strings.length; i++) {
    res += strings[i];
  }

  return res;
}
