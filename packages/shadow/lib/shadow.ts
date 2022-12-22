import { Result } from './result.js';

export interface shadow {
  styles?: Result<CSSStyleSheet | HTMLStyleElement>;
  template?: Result<HTMLTemplateElement>;

  new (...args: any[]): HTMLElement;
}

export function shadow(el: HTMLElement) {
  if (el.shadowRoot) {
    return el.shadowRoot;
  }

  const css = readStyles(el);
  const html = readTemplate(el);
  const shadow = el.attachShadow({ mode: 'open' });

  if (css) {
    const value = css.toValue();

    if (value instanceof CSSStyleSheet) {
      shadow.adoptedStyleSheets = [value];
    } else if (value instanceof HTMLStyleElement) {
      shadow.append(value);
    }
  }

  if (html) {
    shadow.append(html.toValue().content.cloneNode(true));
  }

  return shadow;
}

function readStyles(el: HTMLElement): Result<CSSStyleSheet | HTMLStyleElement> | undefined {
  return Reflect.get(el.constructor, 'styles');
}

function readTemplate(el: HTMLElement): Result<HTMLTemplateElement> | undefined {
  return Reflect.get(el.constructor, 'template');
}
