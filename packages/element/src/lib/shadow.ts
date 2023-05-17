import { ShadowResult } from './result.js';

export function shadow<This extends HTMLElement, T extends ShadowResult>(
  _: undefined,
  ctx: ClassFieldDecoratorContext<This, T>
) {
  let shadow: ShadowRoot;

  ctx.addInitializer(function () {
    shadow = this.shadowRoot || this.attachShadow({ mode: 'open' });
  });

  return (result: T) => {
    result.execute(shadow);

    return result;
  };
}
