import { attr, css, element, html } from "@joist/element";

import { JoistValueEvent } from "../events.js";
import { JToken } from "../token.js";

export class JAttrToken extends JToken {
  mapToAttr: string;

  constructor(raw: string) {
    if (!raw.startsWith("#")) {
      throw new Error(`Invalid attribute token: ${raw}, should start with #`);
    }

    const parsed = raw
      .slice(1)
      .split(":")
      .map((part) => part.trim());

    if (parsed.length !== 2) {
      throw new Error(
        `Invalid attribute token: ${raw}, should be in the form #attrName:attrValue`,
      );
    }

    super(parsed[0]);

    this.mapToAttr = parsed[1];
  }
}

@element({
  tagName: "j-props",
  shadowDom: [css`:host{display:contents}`, html`<slot></slot>`],
})
export class JoistIfElement extends HTMLElement {
  @attr()
  accessor target = "";

  #targetElement: Element | null = null;

  get targetElement(): Element {
    if (this.#targetElement) {
      return this.#targetElement;
    }

    if (this.target) {
      this.#targetElement = this.querySelector(this.target);
    } else {
      this.#targetElement = this.firstElementChild;
    }

    if (!this.#targetElement) {
      throw new Error("Target element not found");
    }

    return this.#targetElement;
  }

  connectedCallback(): void {
    for (const attr of this.attributes) {
      if (attr.name.startsWith("#")) {
        const token = new JAttrToken(attr.name);

        this.dispatchEvent(
          new JoistValueEvent(token, ({ newValue, oldValue }) => {
            if (newValue === oldValue) {
              return;
            }

            let valueToWrite = newValue;

            if (typeof newValue === "object" && newValue !== null) {
              valueToWrite = token.readTokenValueFrom(newValue);
            }

            Reflect.set(this.targetElement, token.mapToAttr, valueToWrite);
          }),
        );
      }
    }
  }
}
