import { attr, css, element, html, template } from '@joist/element';

@element({
  tagName: 'hn-header-link',
  shadow: [
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
    `
  ]
})
export class HnHeader extends HTMLElement {
  @attr()
  accessor href = 'header';

  #update = template();

  attributeChangedCallback() {
    this.#update();
  }
}
