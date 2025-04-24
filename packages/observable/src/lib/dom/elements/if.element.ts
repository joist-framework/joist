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

  isDisplayed = false;

  childTemplate: QueryResult<HTMLTemplateElement> = query("template", this);

  connectedCallback(): void {
    const path = this.bind.split(".").slice(1);
    const isNegative = this.bind.startsWith("!");

    this.parentNode?.dispatchEvent(
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
      if (this.isDisplayed) {
        return;
      }

      this.isDisplayed = true;

      const res = document.importNode(childTemplate.content, true);

      this.appendChild(res);
    } else {
      this.isDisplayed = false;

      while (childTemplate.nextSibling) {
        childTemplate.nextSibling.remove();
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
