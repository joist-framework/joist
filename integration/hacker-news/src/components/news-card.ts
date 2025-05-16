import { attr, css, element, html } from "@joist/element";
import { bind } from "@joist/templating";

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
        <j-val bind="number"></j-val>
      </div>

      <div>
        <div class="title-box">
          <j-bind props="href:href">
            <a id="title" target="_blank">
              <slot></slot>
            </a>
          </j-bind>

          <j-if bind="href">
            <template>
              <j-bind props="href:href">
                <a target="_blank"> (<j-val bind="host"></j-val>) </a>
              </j-bind>
            </template>
          </j-if>
        </div>

        <div class="details">
          <div class="detils-section">
            <j-val bind="points"></j-val>
            points
          </div>

          <div class="detils-section">
            by
            <j-val bind="author"></j-val>
          </div>

          <div class="detils-section">
            <j-val bind="comments"></j-val>
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

  @bind((i) => {
    try {
      return new URL(i.href).hostname;
    } catch (e) {
      return "";
    }
  })
  accessor host = "";
}
