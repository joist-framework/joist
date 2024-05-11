import { ShadowResult } from "./result.js";

export function shadow<This extends HTMLElement, T extends ShadowResult>(
  _: undefined,
  _ctx: ClassFieldDecoratorContext<This, T>,
) {
  return function (this: This, result: T) {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }

    result.execute(this.shadowRoot!);

    return result;
  };
}
