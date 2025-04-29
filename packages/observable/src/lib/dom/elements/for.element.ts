import { attr, css, element, html, query } from "@joist/element";

import { bind } from "../bind.js";
import { JoistValueEvent } from "../events.js";
import { JToken } from "../token.js";

declare global {
  interface HTMLElementTagNameMap {
    "j-for": JositForElement;
    "j-scope": JForScope;
    "j-for-scope": JForScope;
  }
}

@element({
  tagName: "j-scope",
  shadowDom: [css`:host{display:contents}`, html`<slot></slot>`],
})
export class JScope<T = unknown> extends HTMLElement {
  @bind()
  accessor value: T | null = null;
}

@element({
  tagName: "j-for-scope",
  shadowDom: [css`:host{display:contents}`, html`<slot></slot>`],
})
export class JForScope<T = unknown> extends JScope<T> {
  @bind()
  accessor index: number | null = null;

  @bind()
  accessor number: number | null = null;
}

@element({
  tagName: "j-for",
  shadowDom: [css`:host{display:contents}`, html`<slot></slot>`],
})
export class JositForElement extends HTMLElement {
  @attr()
  accessor bind = "";

  #items: Iterable<unknown> = [];
  #template = query("template", this);

  connectedCallback(): void {
    const token = new JToken(this.bind);

    this.dispatchEvent(
      new JoistValueEvent(token, ({ newValue, oldValue }) => {
        if (newValue !== oldValue) {
          if (isIterable(newValue)) {
            this.#items = newValue;
          } else {
            this.#items = [];
          }

          // this.#items = newValue;
          this.render();
        }
      }),
    );
  }

  render(): void {
    this.clear();

    const template = this.#template();
    const children = document.createDocumentFragment();

    let index = 0;

    for (const item of this.#items) {
      const scope = new JForScope();

      scope.append(document.importNode(template.content, true));

      scope.number = index + 1;
      scope.index = index;
      scope.value = item;

      children.appendChild(scope);

      index++;
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

function isIterable<T = unknown>(obj: any): obj is Iterable<T> {
  return obj != null && typeof obj[Symbol.iterator] === "function";
}
