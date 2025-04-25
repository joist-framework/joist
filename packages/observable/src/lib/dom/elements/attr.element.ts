import { css, element, html } from "@joist/element";

import { JToken } from "../token.js";
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
        const [bindTo, childAttr] = attr.name
          .slice(1)
          .split(":")
          .map((part) => part.trim());

        const token = new JToken(bindTo);

        this.dispatchEvent(
          new JoistValueEvent(token, ({ newValue, oldValue }) => {
            if (newValue === oldValue) {
              return;
            }

            if (this.firstElementChild) {
              if (typeof newValue === "object" && newValue !== null) {
                Reflect.set(
                  this.firstElementChild,
                  childAttr,
                  token.readTokenValueFrom(newValue),
                );
              } else {
                Reflect.set(this.firstElementChild, childAttr, newValue);
              }
            }
          }),
        );
      }
    }
  }

  getTemplateValue(obj: object, path: string[]): any {
    let pointer: any = obj;

    for (const part of path) {
      pointer = pointer[part];
    }

    return pointer;
  }
}
