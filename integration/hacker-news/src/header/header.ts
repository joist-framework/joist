import { attr, css, element, html } from '@joist/element';

@element({
  tagName: 'hn-header',
  shadow: [
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
        gap: 0.75rem;
        padding: 0.5rem;
      }

      img {
        border: solid 1px #ffffff;
        margin: 0.5rem;
      }
    `,
    html`
      <img src="./assets/y18.svg" />

      <h1>Hacker News</h1>

      <nav>
        <slot></slot>
      </nav>
    `
  ]
})
export class HnHeader extends HTMLElement {
  @attr()
  accessor role = 'header';
}
