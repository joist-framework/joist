import { attr } from "../../attr.js";
import { element } from "../../element.js";
import { query } from "../../query.js";
import { css, html } from "../../tags.js";

import { bind } from "../bind.js";
import { JoistValueEvent } from "../events.js";
import { JToken } from "../token.js";

declare global {
  interface HTMLElementTagNameMap {
    "j-for": JositForElement;
    "j-for-scope": JForScope;
  }
}

export interface EachCtx<T> {
  value: T | null;
  index: number | null;
  position: number | null;
}

@element({
  tagName: "j-for-scope",
  // prettier-ignore
  shadowDom: [css`:host{display: contents;}`, html`<slot></slot>`],
})
export class JForScope<T = unknown> extends HTMLElement {
  @bind()
  accessor each: EachCtx<T> = {
    value: null,
    index: null,
    position: null,
  };

  @attr()
  accessor key = "";
}

@element({
  tagName: "j-for",
  // prettier-ignore
  shadowDom: [css`:host{display:contents;}`, html`<slot></slot>`],
})
export class JositForElement extends HTMLElement {
  @attr()
  accessor bind = "";

  @attr()
  accessor key = "";

  #template = query("template", this);
  #items: Iterable<unknown> = [];
  #scopes = new Map<unknown, JForScope>();

  connectedCallback(): void {
    const template = this.#template();

    if (this.firstElementChild !== template) {
      throw new Error("The first Node in j-for needs to be a template");
    }

    // collect all scopes from the template to be matched against later
    let currentScope = template.nextElementSibling;
    while (currentScope instanceof JForScope) {
      this.#scopes.set(currentScope.key, currentScope);
      currentScope = currentScope.nextElementSibling;
    }

    const token = new JToken(this.bind);

    this.dispatchEvent(
      new JoistValueEvent(token, ({ newValue, oldValue }) => {
        if (newValue !== oldValue) {
          if (isIterable(newValue)) {
            this.#items = newValue;
          } else {
            this.#items = [];
          }

          // If there are no existing items in the DOM (template is the only child),
          // create all items from scratch
          if (template.nextSibling === null) {
            this.createFromEmpty();
          } else {
            // Otherwise update existing items, reusing DOM nodes where possible
            this.updateItems();
          }
        }
      }),
    );
  }

  // Updates the DOM by either inserting new scopes or moving existing ones
  // to their correct positions based on the current iteration order
  createFromEmpty(): void {
    const template = this.#template();
    const fragment = document.createDocumentFragment();

    let index = 0;

    for (const value of this.#items) {
      const key = hasProperty(value, this.key) ? value[this.key] : index;

      const scope = new JForScope();
      scope.append(document.importNode(template.content, true));
      scope.key = String(key);
      scope.each = { position: index + 1, index, value };

      fragment.appendChild(scope);
      this.#scopes.set(key, scope);

      index++;
    }

    this.append(fragment);
  }

  // Updates the DOM by either inserting new scopes or moving existing ones
  // to their correct positions based on the current iteration order
  updateItems(): void {
    const template = this.#template();
    const leftoverScopes = new Map<unknown, JForScope>(this.#scopes);
    const keyProperty = this.key; // Cache the key property

    let index = 0;

    for (const value of this.#items) {
      // Optimize key lookup by caching the property check
      const key =
        keyProperty && hasProperty(value, keyProperty)
          ? value[keyProperty]
          : index;

      let scope = leftoverScopes.get(key);

      if (!scope) {
        scope = new JForScope();
        scope.append(document.importNode(template.content, true));
        this.#scopes.set(key, scope);
      } else {
        leftoverScopes.delete(key); // Remove from map to track unused scopes
      }

      // Only update if values have changed
      if (scope.key !== key || scope.each.value !== value) {
        scope.key = String(key);
        scope.each = { position: index + 1, index, value };
      }

      const child = this.children[index + 1];

      if (child !== scope) {
        this.insertBefore(scope, child);
      }

      index++;
    }

    // Remove unused scopes
    for (const scope of leftoverScopes.values()) {
      scope.remove();
    }
  }

  disconnectedCallback(): void {
    for (const scope of this.#scopes.values()) {
      scope.remove();
    }

    this.#scopes.clear();
    this.#items = [];
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
