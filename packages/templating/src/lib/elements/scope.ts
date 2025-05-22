import { attr, element, css, html, listen } from "@joist/element";

import type { JoistValueEvent } from "../events.js";

declare global {
  interface HTMLElementTagNameMap {
    "j-scope": JoistScopeElement;
  }
}

@element({
  tagName: "j-val",
  // prettier-ignore
  shadowDom: [css`:host{display: contents;}`, html`<slot></slot>`],
})
export class JoistScopeElement extends HTMLElement {
  @attr()
  accessor name = "";

  @attr()
  accessor value = "";

  #binding: JoistValueEvent | null = null;

  @listen("joist::value")
  onJoistValueFound(e: JoistValueEvent): void {
    if (e.expression.bindTo === this.name) {
      e.stopPropagation();

      this.#binding = e;

      this.#binding.update({ oldValue: null, newValue: this.value });
    }
  }

  attributeChangedCallback(_: string, oldValue: string, newValue: string): void {
    this.#binding?.update({ oldValue, newValue });
  }
}
