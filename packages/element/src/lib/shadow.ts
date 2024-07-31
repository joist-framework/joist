import { JoistShadowResult } from './result.js';

export function shadow() {
  return function shadowDecorator<This extends HTMLElement, T extends JoistShadowResult>(
    _: undefined,
    _ctx: ClassFieldDecoratorContext<This, T>
  ) {
    return function (this: This, result: T) {
      result.run(this.shadowRoot!);

      return result;
    };
  };
}
