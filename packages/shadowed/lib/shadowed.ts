import { Result } from './result';

export interface Shadowed {
  styles?: Result<CSSStyleSheet>;
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
  css?: Result<CSSStyleSheet>
) {
  let shadow: ShadowRoot = el.shadowRoot || el.attachShadow({ mode: 'open' });

  if (css) {
    if (shadow.adoptedStyleSheets) {
      shadow.adoptedStyleSheets = [css.toValue()];
    } else {
      const style = document.createElement('style');
      style.innerHTML = css.toString();

      shadow.append(style);
    }
  }

  if (html) {
    shadow.append(html.toValue().content.cloneNode(true));
  }

  return shadow;
}
