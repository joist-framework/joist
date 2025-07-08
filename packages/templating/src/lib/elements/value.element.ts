import { attr, element, css, html } from "@joist/element";

import { JoistValueEvent } from "../events.js";
import { JExpression } from "../expression.js";

@element({
  // prettier-ignore
  shadowDom: [css`:host{display: contents;}`, html`<slot></slot>`],
})
export class JoistValueElement extends HTMLElement {
  @attr()
  accessor bind = "";

  connectedCallback(): void {
    const token = new JExpression(this.bind);

    this.dispatchEvent(
      new JoistValueEvent(token, (value) => {
        const valueToWrite = token.evaluate(value.newValue);

        if (
          valueToWrite !== null &&
          valueToWrite !== undefined &&
          this.textContent !== valueToWrite
        ) {
          this.textContent = String(valueToWrite);
        }
      }),
    );
  }
}
