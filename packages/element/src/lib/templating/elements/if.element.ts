import { attr } from "../../attr.js";
import { element } from "../../element.js";
import { queryAll } from "../../query-all.js";
import { query } from "../../query.js";
import { css, html } from "../../tags.js";

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

  #templates = queryAll<HTMLTemplateElement>("template", this);

  connectedCallback(): void {
    const templates = Array.from(this.#templates());

    if (templates.length === 0) {
      throw new Error("j-if requires at least one template element");
    }

    if (templates.length > 2) {
      throw new Error("j-if can only have two template elements (if and else)");
    }

    if (
      templates.length === 2 &&
      !templates.some((t) => t.hasAttribute("else"))
    ) {
      throw new Error(
        "When using two templates, one must have the else attribute",
      );
    }

    if (templates.length === 2 && templates[0].hasAttribute("else")) {
      // Swap templates to ensure if template is first
      [templates[0], templates[1]] = [templates[1], templates[0]];
    }

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
    this.#clean();

    const templates = this.#templates();

    const shouldShowIf = isNegative ? !value : value;
    const templateToUse = shouldShowIf ? templates[0] : templates[1];
    const content = document.importNode(templateToUse.content, true);

    this.appendChild(content);
  }

  #clean(): void {
    while (!(this.lastElementChild instanceof HTMLTemplateElement)) {
      this.lastElementChild?.remove();
    }
  }

  disconnectedCallback(): void {
    this.#clean();
  }
}
