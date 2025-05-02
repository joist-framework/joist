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
  shadowDom: [
    css`
      :host {
        display: contents;
      }
    `,
    html`<slot></slot>`,
  ],
})
export class JScope<T = unknown> extends HTMLElement {
  @bind()
  accessor value: T | null = null;
}

@element({
  tagName: "j-for-scope",
  shadowDom: [
    css`
      :host {
        display: contents;
      }
    `,
    html`<slot></slot>`,
  ],
})
export class JForScope<T = unknown> extends JScope<T> {
  @bind()
  accessor index: number | null = null;

  @bind()
  accessor number: number | null = null;

  @attr()
  accessor key = "";
}

@element({
  tagName: "j-for",
  shadowDom: [
    css`
      :host {
        display: contents;
      }
    `,
    html`<slot></slot>`,
  ],
})
export class JositForElement extends HTMLElement {
  @attr()
  accessor bind = "";

  @attr()
  accessor key = "";

  #items: Iterable<unknown> = [];
  #template = query("template", this);
  #scopes = new Map<unknown, JForScope>();

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

          this.updateItems();
        }
      }),
    );
  }

  updateItems(): void {
    const template = this.#template();
    const leftoverScopes = new Map<unknown, JForScope>(this.#scopes);

    let index = 0;

    for (const item of this.#items) {
      const key =
        this.key && hasProperty(item, this.key) ? item[this.key] : index;

      let scope = leftoverScopes.get(key);

      if (!scope) {
        scope = new JForScope();
        scope.append(document.importNode(template.content, true));
      } else {
        leftoverScopes.delete(key); // Remove from map to track unused scopes
      }

      scope.number = index + 1;
      scope.index = index;
      scope.value = item;
      scope.key = String(key);

      if (!this.contains(scope)) {
        const child = this.children[index + 1];

        if (child) {
          child.before(scope);
        } else {
          this.append(scope);
        }

        this.#scopes.set(key, scope);
      }

      index++;
    }

    // Remove unused scopes
    for (const [_, scope] of leftoverScopes) {
      scope.remove();
    }
  }

  disconnectedCallback(): void {
    for (const scope of this.#scopes.values()) {
      scope.remove();
    }

    this.#scopes.clear();
  }
}

function isIterable<T = unknown>(obj: any): obj is Iterable<T> {
  return obj != null && typeof obj[Symbol.iterator] === "function";
}
function hasProperty(
  item: unknown,
  key: string,
): item is Record<string, unknown> {
  return Object.prototype.hasOwnProperty.call(item, key);
}
