import { attr, css, element, html } from "@joist/element";

import { JoistValueEvent } from "../events.js";
import { JToken } from "../token.js";

declare global {
  interface HTMLElementTagNameMap {
    "j-value": JoistValueElement;
  }
}

@element({
  tagName: "j-value",
  shadowDom: [css`:host { display: contents }`, html`<slot></slot>`],
})
export class JoistValueElement extends HTMLElement {
  @attr()
  accessor bind = "";

  connectedCallback(): void {
    const token = new JToken(this.bind);

    this.dispatchEvent(
      new JoistValueEvent(token, (value) => {
        if (typeof value.newValue === "object" && value.newValue !== null) {
          this.innerHTML = String(token.readTokenValueFrom(value.newValue));
        } else {
          this.innerHTML = String(value.newValue);
        }
      }),
    );
  }
}
