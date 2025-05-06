import { attr } from "../../attr.js";
import { element } from "../../element.js";
import { query } from "../../query.js";
import { css, html } from "../../tags.js";

import { JoistValueEvent } from "../events.js";
import { JToken } from "../token.js";

declare global {
  interface HTMLElementTagNameMap {
    "j-async": JoistAsyncElement;
  }
}

export type AsyncState<T = unknown, E = unknown> = {
  status: "loading" | "error" | "success";
  data?: T;
  error?: E;
};

@element({
  tagName: "j-async",
  // prettier-ignore
  shadowDom: [css`:host{display: contents;}`, html`<slot></slot>`],
})
export class JoistAsyncElement extends HTMLElement {
  @attr()
  accessor bind = "";

  #loadingTemplate = query<HTMLTemplateElement>("template[loading]", this);
  #errorTemplate = query<HTMLTemplateElement>("template[error]", this);
  #successTemplate = query<HTMLTemplateElement>("template[success]", this);
  #currentNodes: Node[] = [];

  connectedCallback(): void {
    this.#clean();

    const token = new JToken(this.bind);

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

    let template: HTMLTemplateElement | null = null;

    switch (state.status) {
      case "loading":
        template = this.#loadingTemplate();
        break;
      case "error":
        template = this.#errorTemplate();
        if (template) {
          template.dataset.error = JSON.stringify(state.error);
        }
        break;
      case "success":
        template = this.#successTemplate();
        if (template) {
          template.dataset.data = JSON.stringify(state.data);
        }
        break;
    }

    if (template) {
      const content = document.importNode(template.content, true);
      const nodes = Array.from(content.childNodes);
      this.appendChild(content);
      this.#currentNodes = nodes;
    }
  }

  #isAsyncState(value: unknown): value is AsyncState {
    return (
      typeof value === "object" &&
      value !== null &&
      "status" in value &&
      typeof value.status === "string" &&
      ["loading", "error", "success"].includes(value.status)
    );
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
