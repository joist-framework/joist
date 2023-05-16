import { TemplateResult } from './result.js';

export function shadow<This extends HTMLElement, T extends TemplateResult>(
  _: undefined,
  ctx: ClassFieldDecoratorContext<This, T>
) {
  const shadow = applyShadow(ctx);

  return (result: T) => {
    const root = shadow();

    result.apply(root);

    return result;
  };
}

function applyShadow<This extends HTMLElement>(
  ctx: ClassFieldDecoratorContext<This> | ClassMethodDecoratorContext<This>
) {
  let shadow: ShadowRoot;

  ctx.addInitializer(function () {
    shadow = this.shadowRoot || this.attachShadow({ mode: 'open' });
  });

  return () => shadow;
}
