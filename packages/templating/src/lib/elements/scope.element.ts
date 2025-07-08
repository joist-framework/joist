import { element, css, html } from "@joist/element";

import { bind } from "../bind.js";

@element({
  // prettier-ignore
  shadowDom: [css`:host{display: contents;}`, html`<slot></slot>`],
})
export class JoistScopeElement extends HTMLElement {
  @bind()
  accessor scope: any = null;
}
