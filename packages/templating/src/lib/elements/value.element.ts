import { attr, element, css, html } from "@joist/element";
import { JoistValueEvent } from "../events.js";
import { JExpression } from "../expression.js";

declare global {
  interface HTMLElementTagNameMap {
    "j-val": JoistValueElement;
  }
}

@element({
  tagName: "j-val",
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
        const valueToWrite = String(token.readBoundValueFrom(value.newValue));

        if (
          valueToWrite !== null &&
          valueToWrite !== undefined &&
          this.textContent !== valueToWrite
        ) {
          this.textContent = valueToWrite;
        }
      }),
    );
  }
}
