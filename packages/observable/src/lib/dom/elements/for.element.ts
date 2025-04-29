import { attr, css, element, html, listen, query } from "@joist/element";

import { observe } from "../../observe.js";
import { JoistValueEvent } from "../events.js";
import { JToken } from "../token.js";

declare global {
  interface HTMLElementTagNameMap {
    "j-for": JositForElement;
    "j-for-scope": JoistForScopElement;
  }
}

type ForScopeItem = Record<string | symbol, unknown>;

@element({
  tagName: "j-for-scope",
  shadowDom: [css`:host{display:contents}`, html`<slot></slot>`],
})
export class JoistForScopElement extends HTMLElement {
  @observe()
  accessor item: ForScopeItem = {};

  @listen("joist::value", (host) => host)
  onValue(event: JoistValueEvent): void {
    if (event.token.bindTo in this.item) {
      event.stopPropagation();

      event.cb({ oldValue: null, newValue: this.item[event.token.bindTo] });
    }
  }
}

@element({
  tagName: "j-for",
  shadowDom: [css`:host{display:contents}`, html`<slot></slot>`],
})
export class JositForElement extends HTMLElement {
  @attr()
  accessor bind = "";

  #items: any[] = [];
  #template = query("template", this);

  connectedCallback(): void {
    const token = new JToken(this.bind);

    this.dispatchEvent(
      new JoistValueEvent(token, ({ newValue, oldValue }) => {
        console.log(oldValue, newValue);
        if (newValue !== oldValue) {
          this.#items = Array.isArray(newValue) ? newValue : [];
          this.render();
        }
      }),
    );
  }

  render(): void {
    const template = this.#template();

    this.clear();

    const children = document.createDocumentFragment();

    for (const item of this.#items) {
      const scope = new JoistForScopElement();
      scope.append(document.importNode(template.content, true));

      scope.item = item;

      children.appendChild(scope);
    }

    template.after(children);
  }

  clear(): void {
    const template = this.#template();

    while (template.nextSibling) {
      template.nextSibling.remove();
    }
  }
}
