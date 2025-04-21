import { css, element, html } from "@joist/element";

import { JoistValueEvent } from "../value.events.js";

@element({
  tagName: "j-attr",
  shadowDom: [
    css`
      :host {
        display: contents
      }
    `,
    html`<slot></slot>`,
  ],
})
export class JoistIfElement extends HTMLElement {
  connectedCallback(): void {
    for (const attr of this.attributes) {
      if (attr.name.startsWith("#")) {
        const [token, childAttr] = attr.name
          .slice(1)
          .split(":")
          .map((part) => part.trim());

        this.parentNode?.dispatchEvent(
          new JoistValueEvent(token, (value) => {
            if (this.firstElementChild) {
              Reflect.set(this.firstElementChild, childAttr, value.newValue);
            }
          }),
        );
      }
    }
  }
}
