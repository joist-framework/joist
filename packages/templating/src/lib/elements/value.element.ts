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

  @attr({
    name: "depends-on",
  })
  accessor dependsOn = "";

  async connectedCallback(): Promise<void> {
    const token = new JExpression(this.bind);

    if (this.dependsOn) {
      await Promise.all(
        this.dependsOn.split(",").map((tag) => window.customElements.whenDefined(tag)),
      );
    }

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
