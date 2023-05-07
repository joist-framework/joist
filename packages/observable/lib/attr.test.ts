import { expect, fixture, html } from '@open-wc/testing';

import { attr } from './attr.js';

describe('observable: attr()', () => {
  it('should do stuff', async () => {
    class MyElement extends HTMLElement {
      @attr accessor hello = 'world';
    }

    customElements.define('attr-test-1', MyElement);

    const el = await fixture(html`<attr-test-1></attr-test-1>`);

    expect(el.getAttribute('hello')).to.equal('world');
  });
});
