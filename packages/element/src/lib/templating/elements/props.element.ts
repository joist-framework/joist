import { attr } from "../../attr.js";
import { element } from "../../element.js";
import { css, html } from "../../tags.js";

import { JoistValueEvent } from "../events.js";
import { JToken } from "../token.js";

export class JAttrToken extends JToken {
  mapTo: string;
  mapsToProp: boolean;

  constructor(attr: Attr) {
    if (!attr.name.startsWith("$")) {
      throw new Error(
        `Invalid attribute token: ${attr.name}, should start with $`,
      );
    }

    super(attr.value);

    this.mapsToProp = attr.name.startsWith("$.");

    this.mapTo = attr.name.slice(this.mapsToProp ? 2 : 1);
  }
}

@element({
  tagName: "j-props",
  // prettier-ignore
  shadowDom: [css`:host{display: contents;}`, html`<slot></slot>`],
})
export class JoistIfElement extends HTMLElement {
  @attr()
  accessor target = "";

  connectedCallback(): void {
    for (const child of this.children) {
      for (const attr of child.attributes) {
        if (attr.name.startsWith("$")) {
          const token = new JAttrToken(attr);

          this.dispatchEvent(
            new JoistValueEvent(token, ({ newValue, oldValue }) => {
              if (newValue === oldValue) {
                return;
              }

              let valueToWrite = newValue;

              if (typeof newValue === "object" && newValue !== null) {
                valueToWrite = token.readTokenValueFrom(newValue);
              }

              if (token.mapsToProp) {
                Reflect.set(child, token.mapTo, valueToWrite);
              } else {
                child.setAttribute(token.mapTo, String(valueToWrite));
              }
            }),
          );
        }
      }
    }
  }
}
