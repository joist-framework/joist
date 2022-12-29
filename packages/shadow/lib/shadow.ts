import { Result } from './result.js';

export interface ShadowOpts {
  styles?: Result<CSSStyleSheet | HTMLStyleElement>;
  template?: Result<HTMLTemplateElement>;
}

export function shadow(el: HTMLElement, opts?: ShadowOpts) {
  if (el.shadowRoot) {
    return el.shadowRoot;
  }

  const shadow = el.attachShadow({ mode: 'open' });

  if (opts?.styles) {
    const value = opts.styles.toValue();

    if (value instanceof CSSStyleSheet) {
      shadow.adoptedStyleSheets = [value];
    } else if (value instanceof HTMLStyleElement) {
      shadow.append(value);
    }
  }

  if (opts?.template) {
    shadow.append(opts.template.toValue().content.cloneNode(true));
  }

  return shadow;
}
