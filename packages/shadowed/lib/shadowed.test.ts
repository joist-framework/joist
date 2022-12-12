import { expect } from '@open-wc/testing';

import { shadowed } from './shadowed.js';
import { css, html } from './tags';

describe('shadowed', () => {
  it('should add a shadow root', () => {
    @shadowed
    class MyElement extends HTMLElement {}

    customElements.define('shadowed-1', MyElement);

    const el = new MyElement();

    expect(el.shadowRoot).to.be.instanceOf(ShadowRoot);
  });

  it('should apply a stylesheet', () => {
    @shadowed
    class MyElement extends HTMLElement {
      static styles = css`
        :host {
          display: flex;
        }
      `;
    }

    customElements.define('shadowed-2', MyElement);

    const el = new MyElement();

    expect(el.shadowRoot!.adoptedStyleSheets.length).to.eq(1);
  });

  it('should apply html', () => {
    @shadowed
    class MyElement extends HTMLElement {
      static styles = css`
        :host {
          display: flex;
        }
      `;

      static template = html`<slot></slot>`;
    }

    customElements.define('shadowed-3', MyElement);

    const el = new MyElement();

    expect(el.shadowRoot?.innerHTML).to.eq('<slot></slot>');
  });
});
