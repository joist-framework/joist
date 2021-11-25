import { expect } from '@open-wc/testing';
import { styled } from './styled';

describe('styled', () => {
  it('should apply style sheets to coonostructable stylesheets', () => {
    @styled({
      styles: [
        `:host {
          display: block;
        }`,
        `:host {
          color: red;
        }`,
      ],
    })
    class MyElement extends HTMLElement {
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
