import { expect } from '@open-wc/testing';

import { shadow, ShadowOpts } from './shadow.js';
import { css, html } from './tags.js';

describe('shadow', () => {
  it('should add a shadow root', () => {
    class MyElement extends HTMLElement {
      shadow = shadow(this);
    }

    customElements.define('shadow-1', MyElement);

    const el = new MyElement();

    expect(el.shadowRoot).to.be.instanceOf(ShadowRoot);
  });

  it('should apply a stylesheet', () => {
    const dom: ShadowOpts = {
      styles: css`
        :host {
          display: flex;
        }
      `,
    };

    class MyElement extends HTMLElement {
      shadow = shadow(this, dom);
    }

    customElements.define('shadow-2', MyElement);

    const el = new MyElement();

    expect(el.shadowRoot!.adoptedStyleSheets.length).to.eq(1);
  });

  it('should apply html', () => {
    const dom: ShadowOpts = {
      styles: css`
        :host {
          display: flex;
        }
      `,
      template: html`<slot></slot>`,
    };

    class MyElement extends HTMLElement {
      shadow = shadow(this, dom);
    }

    customElements.define('shadow-3', MyElement);

    const el = new MyElement();

    expect(el.shadowRoot?.innerHTML).to.eq('<slot></slot>');
  });
});
