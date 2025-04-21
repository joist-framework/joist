import {
  type QueryResult,
  attr,
  css,
  element,
  html,
  query,
} from "@joist/element";

import { JoistValueEvent } from "./value.events.js";

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

  childTemplate: QueryResult<HTMLTemplateElement> = query("template", this);

  connectedCallback(): void {
    const childTemplate = this.childTemplate();
    const isNegated = this.bind.startsWith("!");
    const bindToken = isNegated ? this.bind.slice(1) : this.bind;

    this.parentNode?.dispatchEvent(
      new JoistValueEvent(bindToken, (value) => {
        if (value.newValue !== value.oldValue) {
          const valueToCheck = isNegated ? !value.newValue : value.newValue;

          if (valueToCheck === false) {
            while (childTemplate.nextSibling) {
              childTemplate.nextSibling.remove();
            }
          } else {
            const res = document.importNode(childTemplate.content, true);

            this.appendChild(res);
          }
        }
      }),
    );
  }
}
