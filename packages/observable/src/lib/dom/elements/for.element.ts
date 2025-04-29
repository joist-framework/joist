import { attr, css, element, html, listen, query } from "@joist/element";

import type { Changes } from "../../metadata.js";
import { effect, observe } from "../../observe.js";
import { JoistValueEvent } from "../events.js";
import { JToken } from "../token.js";

declare global {
  interface HTMLElementTagNameMap {
    "j-for": JositForElement;
    "j-scope": JScope;
  }
}

type ForScopeItem = Record<string | symbol, unknown>;

@element({
  tagName: "j-scope",
  shadowDom: [css`:host{display:contents}`, html`<slot></slot>`],
})
export class JScope extends HTMLElement {
  @observe()
  accessor context: ForScopeItem = {};

  #ctxEvent: JoistValueEvent | null = null;

  @listen("joist::value", (host) => host)
  onValue(event: JoistValueEvent): void {
    if (event.token.bindTo in this.context) {
      event.stopPropagation();

      this.#ctxEvent = event;

      event.cb({ oldValue: null, newValue: this.context[event.token.bindTo] });
    }
  }

  @effect()
  onContextChange(changes: Changes<this>): void {
    if (this.#ctxEvent) {
      const change = changes.get("context");

      if (change) {
        this.#ctxEvent.cb({
          oldValue: change.oldValue,
          newValue: this.context[this.#ctxEvent.token.bindTo],
        });
      }
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
      const scope = new JScope();
      scope.append(document.importNode(template.content, true));

      scope.context = item;

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
