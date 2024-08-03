import { attr, css, element, html, query } from '@joist/element';

@element({
  tagName: 'hn-header-link',
  shadow: [
    css`
      :host {
        display: inline-flex;
        align-items: center;
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
      <a>
        <slot></slot>
      </a>
    `
  ]
})
export class HnHeader extends HTMLElement {
  @attr()
  accessor href = 'header';

  #a = query('a');

  attributeChangedCallback() {
    this.#a({ href: this.href });
  }
}
