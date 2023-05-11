import { HTMLResult, CSSResult } from './tags.js';

export function template<This extends HTMLElement>(
  _: undefined,
  ctx: ClassFieldDecoratorContext<This, HTMLResult>
) {
  const shadow = applyShadow(ctx);

  return (result: HTMLResult) => {
    const root = shadow();
    root.append(result.toValue().content.cloneNode(true));

    return result;
  };
}

export function styles<This extends HTMLElement>(
  _: undefined,
  ctx: ClassFieldDecoratorContext<This, CSSResult>
) {
  const shadow = applyShadow(ctx);

  return (res: CSSResult) => {
    const root = shadow();
    const value = res.toValue();

    root.adoptedStyleSheets = [...root.adoptedStyleSheets, value];

    return res;
  };
}

function applyShadow<This extends HTMLElement>(ctx: ClassFieldDecoratorContext<This>) {
  let shadow: ShadowRoot;

  ctx.addInitializer(function () {
    shadow = this.shadowRoot || this.attachShadow({ mode: 'open' });
  });

  return () => shadow;
}
