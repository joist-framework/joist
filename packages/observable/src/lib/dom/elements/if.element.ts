import {
  type QueryResult,
  attr,
  css,
  element,
  html,
  query,
} from "@joist/element";

import { JoistValueEvent } from "../events.js";
import { JToken } from "../token.js";

declare global {
  interface HTMLElementTagNameMap {
    "j-if": JoistIfElement;
  }
}

@element({
  tagName: "j-if",
  // prettier-ignore
  shadowDom: [css`:host{display: contents;}`, html`<slot></slot>`],
})
export class JoistIfElement extends HTMLElement {
  @attr()
  accessor bind = "";

  childTemplate: QueryResult<HTMLTemplateElement> = query("template", this);

  connectedCallback(): void {
    // make sure there are no other nodes after the template
    this.#clean();

    const token = new JToken(this.bind);

    this.dispatchEvent(
      new JoistValueEvent(token, ({ newValue, oldValue }) => {
        if (newValue !== oldValue) {
          if (typeof newValue === "object" && newValue !== null) {
            this.apply(token.readTokenValueFrom(newValue), token.isNegated);
          } else {
            this.apply(newValue, token.isNegated);
          }
        }
      }),
    );
  }

  apply(value: unknown, isNegative: boolean): void {
    const childTemplate = this.childTemplate();

    if (isNegative ? !value : value) {
      // only clone the template if it is not already in the DOM
      if (childTemplate.nextSibling === null) {
        const res = document.importNode(childTemplate.content, true);

        this.appendChild(res);
      }
    } else {
      this.#clean();
    }
  }

  #clean() {
    const childTemplate = this.childTemplate();

    while (childTemplate.nextSibling) {
      childTemplate.nextSibling.remove();
    }
  }
}
