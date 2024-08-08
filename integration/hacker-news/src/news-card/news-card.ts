import { attr, css, element, html, template } from '@joist/element';
import { observe, effect } from '@joist/observable';

@element({
  tagName: 'hn-news-card',
  shadow: [
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

      [data-hide='true'] {
        display: none;
      }
    `,
    html`
      <div id="number">
        <!--#:number-->
      </div>

      <div>
        <div class="title-box">
          <a id="title" #:href="href" target="_blank">
            <slot></slot>
          </a>

          <a #:data-hide="hideHost" #:href="href" target="_blank"> (<!--#:host-->) </a>
        </div>

        <div class="details">
          <span>
            <!--#:points-->
            points
          </span>

          <span>
            by
            <!--#:author-->
          </span>

          <span>
            <!--#:comments-->
            comments
          </span>
        </div>
      </div>
    `
  ]
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
  accessor href = '';

  @attr()
  @observe()
  accessor author = '';

  get host() {
    if (this.href) {
      return new URL(this.href).hostname;
    }

    return '';
  }

  get hideHost() {
    return !this.href;
  }

  #render = template();

  connectedCallback() {
    this.#render();
  }

  @effect()
  onPropChange() {
    this.#render();
  }
}
