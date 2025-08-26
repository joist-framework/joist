import { attr, element, query, css, html } from "@joist/element";
import { Change, Changes, effect, observe } from "@joist/observable";

import { BindChange, JoistValueEvent } from "../events.js";
import { JExpression } from "../expression.js";

export interface EachCtx<T> {
  value: T | null;
  index: number | null;
  position: number | null;
}

class JoistForScopeContainer<T = unknown> {
  host: Element;

  get key(): string | null {
    return this.host.getAttribute("key");
  }

  #callbacks: Array<(val: BindChange<EachCtx<T>>) => void> = [];

  @observe()
  accessor each: EachCtx<T> = {
    value: null,
    index: null,
    position: null,
  };

  constructor(host: Element | null) {
    if (host == null) {
      throw new Error("JForScope required a host element");
    }

    this.host = host;

    this.host.addEventListener("joist::value", (e) => {
      if (e.expression.bindTo === "each") {
        e.stopPropagation();

        this.#callbacks.push(e.update);

        e.update({
          oldValue: null,
          newValue: this.each,
          firstChange: true,
        });
      }
    });
  }

  @effect()
  onChange(changes: Changes<this>): void {
    const change = changes.get("each") as Change<EachCtx<T>>;

    for (let cb of this.#callbacks) {
      cb({
        oldValue: change.oldValue,
        newValue: change.newValue,
        firstChange: false,
      });
    }
  }
}

@element({
  // prettier-ignore
  shadowDom: [css`:host{display:contents;}`, html`<slot></slot>`],
})
export class JoistForElement extends HTMLElement {
  @attr()
  accessor bind = "";

  @attr()
  accessor key = "";

  @attr({
    name: "depends-on",
  })
  accessor dependsOn = "";

  #template = query("template", this);
  #items: Iterable<unknown> = [];
  #scopes = new Map<string, JoistForScopeContainer>();

  async connectedCallback(): Promise<void> {
    const template = this.#template();

    if (this.firstElementChild !== template) {
      throw new Error("The first Node in j-for needs to be a template");
    }

    // collect all scopes from the template to be matched against later
    let currentScope = template.nextElementSibling;
    while (currentScope instanceof JoistForScopeContainer) {
      this.#scopes.set(String(currentScope.key), currentScope);
      currentScope = currentScope.nextElementSibling;
    }

    if (this.dependsOn) {
      await Promise.all(
        this.dependsOn.split(",").map((tag) => window.customElements.whenDefined(tag)),
      );
    }

    const token = new JExpression(this.bind);

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
    const keyProperty = this.key;
    const fragment = document.createDocumentFragment();

    let index = 0;
    for (const value of this.#items) {
      let key: unknown = index;

      if (keyProperty && hasProperty(value, keyProperty)) {
        key = value[keyProperty];
      }

      const scope = this.#createScopeContainer();

      scope.host.setAttribute("key", String(key));
      scope.each = { position: index + 1, index, value };

      fragment.appendChild(scope.host);

      this.#scopes.set(String(key), scope);

      index++;
    }

    this.append(fragment);
  }

  // Updates the DOM by either inserting new scopes or moving existing ones
  // to their correct positions based on the current iteration order
  updateItems(): void {
    const leftoverScopes = new Map<unknown, JoistForScopeContainer>(this.#scopes);
    const keyProperty = this.key;

    let index = 0;

    for (const value of this.#items) {
      let key: unknown = index;

      if (keyProperty && hasProperty(value, keyProperty)) {
        key = value[keyProperty];
      }

      let scope = leftoverScopes.get(key);

      if (!scope) {
        scope = scope = this.#createScopeContainer();

        this.#scopes.set(String(key), scope);
      } else {
        leftoverScopes.delete(key); // Remove from map to track unused scopes
      }

      // Only update if values have changed
      if (scope.key !== key || scope.each.value !== value) {
        scope.host.setAttribute("key", String(key));
        scope.each = { position: index + 1, index, value };
      }

      const child = this.children[index + 1];

      if (child !== scope.host) {
        this.insertBefore(scope.host, child);
      }

      index++;
    }

    // Remove unused scopes
    for (const scope of leftoverScopes.values()) {
      scope.host.remove();
    }
  }

  disconnectedCallback(): void {
    for (const scope of this.#scopes.values()) {
      scope.host.remove();
    }

    this.#scopes.clear();
    this.#items = [];
  }

  #createScopeContainer() {
    const template = this.#template();
    const content = template.content.firstElementChild;

    if (content === null) {
      throw new Error("template must contain a single parent element");
    }

    const fragment = document.importNode(content, true);

    return new JoistForScopeContainer(fragment);
  }
}

function isIterable<T = unknown>(obj: any): obj is Iterable<T> {
  return obj != null && typeof obj[Symbol.iterator] === "function";
}

function hasProperty(item: unknown, key: string): item is Record<string, unknown> {
  return Object.prototype.hasOwnProperty.call(item, key);
}
