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

  @attr()
  accessor value = "true";

  childTemplate: QueryResult<HTMLTemplateElement> = query("template", this);

  connectedCallback(): void {
    const childTemplate = this.childTemplate();

    console.log(this.parentNode);

    this.parentNode?.dispatchEvent(
      new JoistValueEvent(this.bind, (value) => {
        if (value.newValue !== value.oldValue) {
          const compareTo =
            this.value === "true" || this.value === "false"
              ? Boolean(this.value)
              : this.value;

          console.log("####", value.newValue, compareTo);

          if (value.newValue === compareTo) {
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
