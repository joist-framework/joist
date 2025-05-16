import { attr, css, element, html } from "@joist/element";
import { bind } from "@joist/templating";

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
      <j-bind props="href:href">
        <a>
          <slot></slot>
        </a>
      </j-bind>
    `,
  ],
})
export class HnHeader extends HTMLElement {
  @attr()
  @bind()
  accessor href = "#";
}
