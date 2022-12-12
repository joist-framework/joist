import { Result } from './result';

export interface Shadowed {
  styles?: Result<CSSStyleSheet | HTMLStyleElement>;
  template?: Result<HTMLTemplateElement>;

  new (...args: any[]): HTMLElement;
}

export function shadowed<T extends Shadowed>(CustomElement: T) {
  const styles = CustomElement.styles;
  const template = CustomElement.template;

  return new Proxy(CustomElement, {
    construct(a, b, c) {
      const instance: HTMLElement = Reflect.construct(a, b, c);

      applyShadow(instance, template, styles);

      return instance;
    },
  });
}

export function applyShadow(
  el: HTMLElement,
  html?: Result<HTMLTemplateElement>,
  css?: Result<CSSStyleSheet | HTMLStyleElement>
) {
  let shadow: ShadowRoot = el.shadowRoot || el.attachShadow({ mode: 'open' });

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
