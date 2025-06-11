import { element, css, html } from "@joist/element";

import { bind } from "../bind.js";

declare global {
  interface HTMLElementTagNameMap {
    "j-scope": JoistScopeElement;
  }
}

@element({
  tagName: "j-scope",
  // prettier-ignore
  shadowDom: [css`:host{display: contents;}`, html`<slot></slot>`],
})
export class JoistScopeElement extends HTMLElement {
  @bind()
  accessor scope: any = null;
}
