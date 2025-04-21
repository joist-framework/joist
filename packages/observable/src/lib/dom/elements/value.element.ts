import { attr, css, element, html } from "@joist/element";

import { JoistValueEvent } from "../value.events.js";

@element({
  tagName: "j-value",
  shadowDom: [
    css`
      :host {
        display: contents
      }
    `,
    html`
      <slot></slot>
    `,
  ],
})
export class JoistValueElement extends HTMLElement {
  @attr()
  accessor bind = "";

  connectedCallback(): void {
    this.parentNode?.dispatchEvent(
      new JoistValueEvent(this.bind, (value) => {
        this.innerHTML = String(value.newValue);
      }),
    );
  }
}
