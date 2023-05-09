import { expect, fixture, html } from '@open-wc/testing';

import { attr } from './attr.js';

describe('observable: attr()', () => {
  it('should write default value to attribute', async () => {
    class MyElement extends HTMLElement {
      @attr accessor hello = 'world';
    }

    customElements.define('attr-test-1', MyElement);

    const el = await fixture(html`<attr-test-1></attr-test-1>`);

    expect(el.getAttribute('hello')).to.equal('world');
  });

  it('should read default value from attribute', async () => {
    class MyElement extends HTMLElement {
      @attr accessor hello = 'world';
    }

    customElements.define('attr-test-2', MyElement);

    const el = await fixture<MyElement>(html`<attr-test-2 hello="foo"></attr-test-2>`);

    expect(el.hello).to.equal('foo');
  });
});
