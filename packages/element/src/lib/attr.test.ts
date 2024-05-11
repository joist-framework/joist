import { expect, fixture, html } from '@open-wc/testing';

import { attr } from './attr.js';

describe('@attr()', () => {
  it('should read and parse the correct values', async () => {
    class MyElement extends HTMLElement {
      @attr accessor value1 = 100; // no attribute
      @attr accessor value2 = 0; // number
      @attr accessor value3 = false; // boolean
      @attr accessor value4 = 'hello'; // string
    }

    customElements.define('attr-test-2', MyElement);

    const el = await fixture<MyElement>(
      html`<attr-test-2 value2="2" value3 value4="world"></attr-test-2>`,
    );

    expect(el.value1).to.equal(100);
    expect(el.value2).to.equal(2);
    expect(el.value3).to.equal(true);
    expect(el.value4).to.equal('world');
  });

  it('should not write falsy props to attributes', async () => {
    class MyElement extends HTMLElement {
      @attr accessor value1 = undefined;
      @attr accessor value2 = null;
      @attr accessor value3 = '';
    }

    customElements.define('attr-test-3', MyElement);

    const el = await fixture<MyElement>(html`<attr-test-3></attr-test-3>`);

    expect(el.hasAttribute('value1')).to.be.false;
    expect(el.hasAttribute('value2')).to.be.false;
    expect(el.hasAttribute('value3')).to.be.false;
  });

  it('should update attributes when props are changed', async () => {
    class MyElement extends HTMLElement {
      @attr accessor value1 = 'hello'; // no attribute
      @attr accessor value2 = 0; // number
      @attr accessor value3 = true; // boolean
      @attr accessor value4 = false; // boolean
    }

    customElements.define('attr-test-4', MyElement);

    const el = await fixture<MyElement>(html`<attr-test-4></attr-test-4>`);

    el.value1 = 'world';
    el.value2 = 100;
    el.value3 = false;
    el.value4 = true;

    expect(el.getAttribute('value1')).to.equal('world');
    expect(el.getAttribute('value2')).to.equal('100');
    expect(el.hasAttribute('value3')).to.be.false;
    expect(el.hasAttribute('value4')).to.be.true;
  });
});
