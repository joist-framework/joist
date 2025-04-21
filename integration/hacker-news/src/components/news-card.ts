import { attr, css, element, html } from "@joist/element";
import { type Changes, effect } from "@joist/observable";
import { bind } from "@joist/observable/dom.js";

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
      <div id="number">
        <j-value bind="number"></j-value>
      </div>

      <div>
        <div class="title-box">
          <j-attr #href:href>
            <a id="title" target="_blank">
              <slot></slot>
            </a>
          </j-attr>

          <j-if bind="href">
            <template>
              <j-attr #href:href>
                <a target="_blank">
                  (<j-value bind="host"></j-value>)
                </a>
              </j-attr>
            </template>
          </j-if>
        </div>

        <div class="details">
          <div class="detils-section">
            <j-value bind="points"></j-value>
            points
          </div>

          <div class="detils-section">
            by
            <j-value bind="author"></j-value>
          </div>

          <div class="detils-section">
            <j-value bind="comments"></j-value>
            comments
          </div>
        </div>
      </div>
    `,
  ],
})
export class HnNewsCard extends HTMLElement {
  @attr()
  @bind()
  accessor number = 1;

  @attr()
  @bind()
  accessor comments = 0;

  @attr()
  @bind()
  accessor points = 0;

  @attr()
  @bind()
  accessor href = "";

  @attr()
  @bind()
  accessor author = "";

  @bind()
  accessor host = "";

  @effect()
  onPropChange(changes: Changes<this>) {
    if (changes.has("href")) {
      this.host = new URL(this.href).hostname;
    }
  }
}
