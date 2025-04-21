import {
  type QueryResult,
  attr,
  css,
  element,
  html,
  query,
} from "@joist/element";
// import { bind } from "@joist/observable/dom.js";

import { JoistValueEvent } from "./value.events.js";
@element({
  tagName: "j-for",
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

    this.parentNode?.dispatchEvent(
      new JoistValueEvent(this.bind, (value) => {
        if (Array.isArray(value.newValue)) {
          for (const _item of value.newValue) {
            const res = document.importNode(childTemplate.content, true);

            this.append(res);
          }
        }
      }),
    );
  }
}
