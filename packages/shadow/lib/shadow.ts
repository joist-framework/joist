import { Result } from './result.js';

export interface ShadowTemplate {
  css?: Result<CSSStyleSheet | HTMLStyleElement>;
  html?: Result<HTMLTemplateElement>;
}

export function shadow(el: HTMLElement, template?: ShadowTemplate) {
  if (el.shadowRoot) {
    return el.shadowRoot;
  }

  const shadow = el.attachShadow({ mode: 'open' });

  if (template?.css) {
    const value = template.css.toValue();

    if (value instanceof CSSStyleSheet) {
      shadow.adoptedStyleSheets = [value];
    } else if (value instanceof HTMLStyleElement) {
      shadow.append(value);
    }
  }

  if (template?.html) {
    shadow.append(template.html.toValue().content.cloneNode(true));
  }

  return shadow;
}
