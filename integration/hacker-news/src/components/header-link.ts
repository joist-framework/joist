import { attr, css, element, html } from "@joist/element";
import { template } from "@joist/element/template.js";

@element({
	tagName: "hn-header-link",
	shadowDom: [
		css`
      :host {
        display: inline-flex;
        align-items: center;
        padding: 0.5rem;
      }

      a {
        color: #000;
        font-size: 10pt;
        text-decoration: none;
      }

      a:visited {
        color: #000;
      }

      a:hover {
        text-decoration: underline;
      }
    `,
		html`
      <a #:href="href">
        <slot></slot>
      </a>
    `,
	],
})
export class HnHeader extends HTMLElement {
	@attr()
	accessor href = "#";

	#update = template();

	attributeChangedCallback() {
		this.#update();
	}
}
