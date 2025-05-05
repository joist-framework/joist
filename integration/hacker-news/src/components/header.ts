import { attr, css, element, html } from "@joist/element";
import { bind } from "@joist/element/templating.js";

@element({
  tagName: "hn-header",
  shadowDom: [
    css`
      :host {
        background: rgb(255, 102, 0);
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }

      h1 {
        font-size: 1rem;
        margin: 0;
        padding: 0.5rem;
      }

      nav {
        display: flex;
        align-items: center;
      }

      img {
        border: solid 1px #ffffff;
        margin: 0.5rem;
      }
    `,
    html`
      <j-props>
        <img $.src="img" aria-hidden="true" height="20" width="20" />
      </j-props>

      <h1>Hacker News</h1>

      <nav>
        <slot></slot>
      </nav>
    `,
  ],
})
export class HnHeader extends HTMLElement {
  @attr()
  accessor role = "banner";

  @attr()
  @bind()
  accessor img = "/public/images/y18.svg";
}
