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
        color: #828282;
        display: flex;
        gap: 1rem;
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

          <a id="link" #:href="href" target="_blank"> (<!--#:shortHref-->) </a>
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

  #update = template();

  attributeChangedCallback() {
    const url = new URL(this.href);
    const pathname = url.pathname !== '/' ? url.pathname : '';

    this.shortHref = `${url.hostname}${pathname}`;

    this.#update();
  }
}
