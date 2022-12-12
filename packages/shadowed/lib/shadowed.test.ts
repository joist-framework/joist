import { shadowed } from './shadowed.js';
import { css, html } from './tags';

describe('shadowed', () => {
  it('should work', () => {
    @shadowed
    class MyElement extends HTMLElement {
      static styles = css`
        :host {
          display: flex;
        }
      `;

      static template = html`
        <h1>
          <slot name="title"></slot>
        </h1>

        <slot></slot>
      `;
    }

    customElements.define('shadowed-1', MyElement);
  });
});
