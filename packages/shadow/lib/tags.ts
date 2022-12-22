import { Result } from './result.js';

export function html(strings: TemplateStringsArray): Result<HTMLTemplateElement> {
  return new Result(strings, (val) => {
    const el = document.createElement('template');
    el.innerHTML = val;

    return el;
  });
}

export function css(strings: TemplateStringsArray): Result<CSSStyleSheet | HTMLStyleElement> {
  return new Result(strings, (val) => {
    if (document.adoptedStyleSheets) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(val);

      return sheet;
    }

    const style = document.createElement('style');
    style.innerHTML = val;

    return style;
  });
}
