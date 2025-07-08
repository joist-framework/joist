import { attr, element, queryAll, css, html } from "@joist/element";

import { bind } from "../bind.js";
import { JoistValueEvent } from "../events.js";
import { JExpression } from "../expression.js";

export type AsyncState<T = unknown, E = unknown> = {
  status: "loading" | "error" | "success";
  data?: T;
  error?: E;
};

@element({
  // prettier-ignore
  shadowDom: [css`:host{display: contents;}`, html`<slot></slot>`],
})
export class JoistAsyncElement extends HTMLElement {
  @attr()
  accessor bind = "";

  @bind()
  accessor state: AsyncState | null = null;

  #templates = queryAll<HTMLTemplateElement>("template", this);
  #currentNodes: Node[] = [];
  #cachedTemplates: {
    loading?: HTMLTemplateElement;
    error?: HTMLTemplateElement;
    success?: HTMLTemplateElement;
  } = {
    loading: undefined,
    error: undefined,
    success: undefined,
  };

  connectedCallback(): void {
    this.#clean();

    // Cache all templates
    const templates = Array.from(this.#templates());

    this.#cachedTemplates = {
      loading: templates.find((t) => t.hasAttribute("loading")),
      error: templates.find((t) => t.hasAttribute("error")),
      success: templates.find((t) => t.hasAttribute("success")),
    };

    const token = new JExpression(this.bind);

    this.dispatchEvent(
      new JoistValueEvent(token, ({ newValue, oldValue }) => {
        if (newValue !== oldValue) {
          if (newValue instanceof Promise) {
            this.#handlePromise(newValue);
          } else if (this.#isAsyncState(newValue)) {
            this.#handleState(newValue);
          } else {
            console.warn("j-async bind value must be a Promise or AsyncState");
          }
        }
      }),
    );
  }

  #isAsyncState(value: unknown): value is AsyncState {
    return (
      typeof value === "object" &&
      value !== null &&
      "status" in value &&
      (value.status === "loading" || value.status === "error" || value.status === "success")
    );
  }

  async #handlePromise(promise: Promise<unknown>): Promise<void> {
    try {
      this.#handleState({ status: "loading" });
      const data = await promise;
      this.#handleState({ status: "success", data });
    } catch (error) {
      this.#handleState({ status: "error", error });
    }
  }

  #handleState(state: AsyncState): void {
    this.#clean();

    let template: HTMLTemplateElement | undefined = undefined;

    this.state = state;

    switch (state.status) {
      case "loading":
        template = this.#cachedTemplates.loading;
        break;

      case "error":
        template = this.#cachedTemplates.error;
        break;

      case "success":
        template = this.#cachedTemplates.success;
        break;
    }

    if (template) {
      const content = document.importNode(template.content, true);
      const nodes = Array.from(content.childNodes);
      this.appendChild(content);
      this.#currentNodes = nodes;
    }
  }

  #clean(): void {
    for (const node of this.#currentNodes) {
      node.parentNode?.removeChild(node);
    }
    this.#currentNodes = [];
  }

  disconnectedCallback(): void {
    this.#clean();
  }
}
