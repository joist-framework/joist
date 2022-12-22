import { expect } from '@open-wc/testing';

import { shadow } from './shadowed.js';
import { css, html } from './tags.js';

describe('shadowed', () => {
  it('should add a shadow root', () => {
    class MyElement extends HTMLElement {
      shadow = shadow(this);
    }

    customElements.define('shadowed-1', MyElement);

    const el = new MyElement();

    expect(el.shadowRoot).to.be.instanceOf(ShadowRoot);
  });

  it('should apply a stylesheet', () => {
    class MyElement extends HTMLElement {
      static styles = css`
        :host {
          display: flex;
        }
      `;

      shadow = shadow(this);
    }

    customElements.define('shadowed-2', MyElement);

    const el = new MyElement();

    expect(el.shadowRoot!.adoptedStyleSheets.length).to.eq(1);
  });

  it('should apply html', () => {
    class MyElement extends HTMLElement {
      static styles = css`
        :host {
          display: flex;
        }
      `;

      static template = html`<slot></slot>`;

      shadow = shadow(this);
    }

    customElements.define('shadowed-3', MyElement);

    const el = new MyElement();

    expect(el.shadowRoot?.innerHTML).to.eq('<slot></slot>');
  });
});
