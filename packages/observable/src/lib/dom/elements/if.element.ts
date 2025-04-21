import {
  type QueryResult,
  attr,
  css,
  element,
  html,
  query,
} from "@joist/element";

import { JoistValueEvent } from "../value.events.js";

@element({
  tagName: "j-if",
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
export class JoistIfElement extends HTMLElement {
  @attr()
  accessor bind = "";

  @attr()
  accessor equals = "";

  childTemplate: QueryResult<HTMLTemplateElement> = query("template", this);

  connectedCallback(): void {
    const childTemplate = this.childTemplate();

    this.parentNode?.dispatchEvent(
      new JoistValueEvent(this.bind, (value) => {
        if (value.newValue !== value.oldValue) {
          const compareTo =
            this.equals === "true" || this.equals === "false"
              ? Boolean(this.equals)
              : this.equals;

          if (
            !childTemplate.nextSibling && this.equals === ""
              ? value.newValue
              : value.newValue === compareTo
          ) {
            const res = document.importNode(childTemplate.content, true);

            this.appendChild(res);
          } else {
            while (childTemplate.nextSibling) {
              childTemplate.nextSibling.remove();
            }
          }
        }
      }),
    );
  }
}
