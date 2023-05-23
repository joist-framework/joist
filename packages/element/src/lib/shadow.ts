import { ShadowResult } from './result.js';

export function shadow<This extends HTMLElement, T extends ShadowResult>(
  _: undefined,
  ctx: ClassFieldDecoratorContext<This, T>
) {
  ctx.addInitializer(function () {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
  });

  return function (this: This, result: T) {
    result.execute(this.shadowRoot!);

    return result;
  };
}
