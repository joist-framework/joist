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
        display: contents;
      }
    `,
    html` <slot></slot> `,
  ],
})
export class JoistIfElement extends HTMLElement {
  @attr()
  accessor bind = "";

  childTemplate: QueryResult<HTMLTemplateElement> = query("template", this);

  connectedCallback(): void {
    // make sure there are no other nodes after the template
    this.#clean();

    const path = this.bind.split(".").slice(1);
    const isNegative = this.bind.startsWith("!");

    this.dispatchEvent(
      new JoistValueEvent(this.bind, ({ newValue, oldValue }) => {
        if (newValue && newValue !== oldValue) {
          if (typeof newValue === "object") {
            this.apply(this.getTemplateValue(newValue, path), isNegative);
          } else {
            this.apply(newValue, isNegative);
          }
        }
      }),
    );
  }

  apply(value: unknown, isNegative: boolean): void {
    const childTemplate = this.childTemplate();

    if (isNegative ? !value : value) {
      if (childTemplate.nextSibling === null) {
        const res = document.importNode(childTemplate.content, true);

        this.appendChild(res);
      }
    } else {
      this.#clean();
    }
  }

  getTemplateValue(obj: object, path: string[]): any {
    let pointer: any = obj;

    for (const part of path) {
      pointer = pointer[part];
    }

    return pointer;
  }

  #clean() {
    const childTemplate = this.childTemplate();

    while (childTemplate.nextSibling) {
      childTemplate.nextSibling.remove();
    }
  }
}
