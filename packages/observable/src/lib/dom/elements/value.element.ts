import { attr, css, element, html } from "@joist/element";

import { JoistValueEvent } from "../value.events.js";

@element({
  tagName: "j-value",
  shadowDom: [
    css`
      :host {
        display: contents;
      }
    `,
    html` <slot></slot> `,
  ],
})
export class JoistValueElement extends HTMLElement {
  @attr()
  accessor bind = "";

  connectedCallback(): void {
    const path = this.bind.split(".").slice(1);

    this.dispatchEvent(
      new JoistValueEvent(this.bind, (value) => {
        if (typeof value.newValue === "object" && value.newValue !== null) {
          this.innerHTML = String(this.getTemplateValue(value.newValue, path));
        } else {
          this.innerHTML = String(value.newValue);
        }
      }),
    );
  }

  getTemplateValue(obj: unknown, path: string[]): any {
    let pointer: any = obj;

    for (const part of path) {
      pointer = pointer[part];
    }

    return pointer;
  }
}
