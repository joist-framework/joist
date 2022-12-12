import { Result } from './result.js';

export function html(strings: TemplateStringsArray): Result<HTMLTemplateElement> {
  return new Result(strings, (val) => {
    const el = document.createElement('template');
    el.innerHTML = val;

    return el;
  });
}

export function css(strings: TemplateStringsArray): Result<CSSStyleSheet> {
  return new Result(strings, (val) => {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(val);

    return sheet;
  });
}
