import { attr, css, element, html, template } from '@joist/element';

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

          <a #:data-hide="hideLink" #:href="href" target="_blank"> (<!--#:shortHref-->) </a>
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
  @attr() accessor number = 1;
  @attr() accessor comments = 0;
  @attr() accessor points = 0;
  @attr() accessor href = '';
  @attr() accessor author = '';

  shortHref = '';
  hideLink = !this.href;

  #render = template();

  attributeChangedCallback(attr: string) {
    if (attr === 'href') {
      if (this.href) {
        this.shortHref = new URL(this.href).hostname;
      }

      this.hideLink = !this.href;
    }

    this.#render();
  }
}
