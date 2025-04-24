import {
  type QueryResult,
  attr,
  css,
  element,
  html,
  listen,
  query,
} from "@joist/element";

import { JoistValueEvent } from "../value.events.js";

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
export class JoistForElement extends HTMLElement {
  @attr()
  accessor bind = "";

  @attr()
  accessor key = "";

  childTemplate: QueryResult<HTMLTemplateElement> = query("template", this);

  items: any[] = [];
  bindings: Array<() => void> = [];

  connectedCallback(): void {
    const childTemplate = this.childTemplate();

    this.dispatchEvent(
      new JoistValueEvent(this.bind, (value) => {
        if (Array.isArray(value.newValue)) {
          if (value.newValue !== value.oldValue) {
            let index = 0;

            for (const item of value.newValue) {
              if (!this.items.includes(item)) {
                this.items.push(item);

                const instance = document.importNode(
                  childTemplate.content,
                  true,
                );

                if (instance.firstElementChild) {
                  instance.firstElementChild.setAttribute(
                    "data-key",
                    `${index}`,
                  );
                }

                this.appendChild(instance);
              }

              index++;
            }
          } else {
            for (const binding of this.bindings) {
              binding();
            }
          }
        }
      }),
    );
  }

  @listen("joist::value")
  onValue(e: JoistValueEvent): void {
    e.stopPropagation();

    if (e.target !== this) {
      if (e.target instanceof HTMLElement) {
        const root = e.target.closest("[data-key]");

        if (root) {
          const index = root.getAttribute("data-key");

          e.cb({
            oldValue: null,
            newValue: this.items[Number(index)][e.bindTo],
          });

          this.bindings.push(() => {
            e.cb({
              oldValue: null,
              newValue: this.items[Number(index)][e.bindTo],
            });
          });
        }
      }
    }
  }
}
