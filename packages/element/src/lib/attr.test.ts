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

  it('should write boolean attr values', async () => {
    class MyElement extends HTMLElement {
      @attr accessor hello = true;
    }

    customElements.define('attr-test-3', MyElement);

    const el = await fixture<MyElement>(html`<attr-test-3></attr-test-3>`);

    expect(el.getAttribute('hello')).to.equal('');

    el.hello = false;

    expect(el.getAttribute('hello')).to.equal(null);
  });

  it('should parse to boolean values', async () => {
    class MyElement extends HTMLElement {
      @attr accessor hello = false;
    }

    customElements.define('attr-test-4', MyElement);

    const el = await fixture<MyElement>(html`<attr-test-4 hello></attr-test-4>`);

    expect(el.hello).to.equal(true);
  });

  it('should read attributes as number if prop is of type number', async () => {
    class MyElement extends HTMLElement {
      @attr accessor value = 0;
    }

    customElements.define('attr-test-5', MyElement);

    const el = await fixture<MyElement>(html`<attr-test-5 value="100"></attr-test-5>`);

    expect(el.value).to.equal(100);
  });

  it('should NOT read attributes as number if prop is of type string', async () => {
    class MyElement extends HTMLElement {
      @attr accessor value = '0';
    }

    customElements.define('attr-test-6', MyElement);

    const el = await fixture<MyElement>(html`<attr-test-6 value="100"></attr-test-6>`);

    expect(el.value).to.equal('100');
  });

  it('should not write undefined props to attributes', async () => {
    class MyElement extends HTMLElement {
      @attr accessor value1 = undefined;
      @attr accessor value2 = null;
      @attr accessor value3 = '';
    }

    customElements.define('attr-test-7', MyElement);

    const el = await fixture<MyElement>(html`<attr-test-7></attr-test-6>`);

    expect(el.hasAttribute('value1')).to.be.false;
    expect(el.hasAttribute('value2')).to.be.false;
    expect(el.hasAttribute('value3')).to.be.false;
  });

  it('should read and parse the correct values', async () => {
    class MyElement extends HTMLElement {
      @attr accessor value1 = 100; // no attribute
      @attr accessor value2 = 0; // number
      @attr accessor value3 = false; // boolean
      @attr accessor value4 = 'hello'; // string
    }

    customElements.define('attr-test-8', MyElement);

    const el = await fixture<MyElement>(
      html`<attr-test-8 value2="2" value3 value4="world"></attr-test-8>`
    );

    expect(el.value1).to.equal(100);
    expect(el.value2).to.equal(2);
    expect(el.value3).to.equal(true);
    expect(el.value4).to.equal('world');
  });
});
