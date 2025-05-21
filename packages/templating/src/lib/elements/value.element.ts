import { attr, element, css, html } from "@joist/element";
import { JoistValueEvent } from "../events.js";
import { JToken } from "../token.js";

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
    const token = new JToken(this.bind);

    this.dispatchEvent(
      new JoistValueEvent(token, (value) => {
        const valueToWrite = String(token.readTokenValueFrom(value.newValue));

        if (this.textContent !== valueToWrite) {
          this.textContent = valueToWrite;
        }
      }),
    );
  }
}
