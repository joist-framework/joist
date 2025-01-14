import { attr, css, element, html, ready } from "@joist/element";
import { template } from "@joist/element/template.js";
import { effect, observe } from "@joist/observable";

@element({
  tagName: "hn-news-card",
  shadowDom: [
    css`
      :host {
        padding: 1rem;
        display: flex;
        gap: 0.5rem;
      }

      a {
        color: #000;
        text-decoration: none;
      }

      a:visited {
        text-decoration: none;
      }

      #title {
        font-size: 1.1em;
      }

      .details {
        color: #716f6f;
        display: flex;
        gap: 1rem;
      }
    `,
    html`
      <div id="number" #:bind="number"></div>

      <div>
        <div class="title-box">
          <a id="title" #:href="href" target="_blank">
            <slot></slot>
          </a>

          <a #:hidden="!href" #:href="href" target="_blank"> (<span #:bind="host"></span>) </a>
        </div>

        <div class="details">
          <div class="detils-section">
            <span #:bind="points"></span>
            points
          </div>

          <div class="detils-section">
            by
            <span #:bind="author"></span>
          </div>

          <div class="detils-section">
            <span #:bind="comments"></span>
            comments
          </div>
        </div>
      </div>
    `,
  ],
})
export class HnNewsCard extends HTMLElement {
  @attr()
  @observe()
  accessor number = 1;

  @attr()
  @observe()
  accessor comments = 0;

  @attr()
  @observe()
  accessor points = 0;

  @attr()
  @observe()
  accessor href = "";

  @attr()
  @observe()
  accessor author = "";

  get host() {
    try {
      return new URL(this.href).hostname;
    } catch {
      return "";
    }
  }

  #render = template();

  @ready()
  onElementReady() {
    this.#render();
  }

  @effect()
  onPropChange() {
    this.#render();
  }
}
