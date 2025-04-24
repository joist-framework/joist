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

  childTemplate: QueryResult<HTMLTemplateElement> = query("template", this);

  connectedCallback(): void {
    const path = this.bind.split(".").slice(1);

    this.parentNode?.dispatchEvent(
      new JoistValueEvent(this.bind, (value) => {
        if (value.newValue !== value.oldValue) {
          if (value.newValue) {
            if (typeof value.newValue === "object") {
              if (this.getTemplateValue(value.newValue, path)) {
                this.#render();
              } else {
                this.#clear();
              }
            } else {
              this.#render();
            }
          } else {
            this.#clear();
          }
        }
      }),
    );
  }

  getTemplateValue(obj: object, path: string[]): any {
    let pointer: any = obj;

    for (const part of path) {
      pointer = pointer[part];
    }

    return pointer;
  }

  #clear() {
    const childTemplate = this.childTemplate();

    while (childTemplate.nextSibling) {
      childTemplate.nextSibling.remove();
    }
  }

  #render() {
    const childTemplate = this.childTemplate();

    const res = document.importNode(childTemplate.content, true);

    this.appendChild(res);
  }
}
