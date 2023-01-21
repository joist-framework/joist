import { CSSResult, HTMLResult } from './tags.js';

export interface ShadowTemplate {
  css?: CSSResult | CSSResult[];
  html?: HTMLResult;
}

export function shadow(el: HTMLElement, template?: ShadowTemplate): ShadowRoot {
  if (el.shadowRoot) {
    return el.shadowRoot;
  }

  const shadow = el.attachShadow({ mode: 'open' });

  if (template?.css) {
    if (Array.isArray(template.css)) {
      template.css.forEach((result) => {
        applyStyles(shadow, result);
      });
    } else {
      applyStyles(shadow, template.css);
    }
  }

  if (template?.html) {
    shadow.append(template.html.toValue().content.cloneNode(true));
  }

  return shadow;
}

function applyStyles(root: ShadowRoot, result: CSSResult) {
  const value = result.toValue();

  if (value instanceof CSSStyleSheet) {
    root.adoptedStyleSheets = [...root.adoptedStyleSheets, value];
  } else if (value instanceof HTMLStyleElement) {
    root.append(value);
  }
}
