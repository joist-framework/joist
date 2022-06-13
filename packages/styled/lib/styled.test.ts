import { expect } from '@open-wc/testing';

import { css } from './css-tag';
import { styled } from './styled';

describe('styled', () => {
  it('should apply style sheets to coonostructable stylesheets', () => {
    @styled
    class MyElement extends HTMLElement {
      static styles = [
        css`
          :host {
            display: block;
          }
        `,
        css`
          :host {
            color: red;
          }
        `,
      ];

      constructor() {
        super();

        this.attachShadow({ mode: 'open' });
      }
    }

    customElements.define('my-element', MyElement);

    const el = new MyElement();

    expect(el.shadowRoot?.adoptedStyleSheets.length).to.equal(2);
  });
});
