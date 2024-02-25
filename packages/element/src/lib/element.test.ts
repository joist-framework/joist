import { expect, fixture, html } from '@open-wc/testing';

import { attr } from './attr.js';
import { element } from './element.js';
import { tagName } from './tag-name.js';

describe('element()', () => {
  it('should write default value to attribute', async () => {
    @element
    class MyElement extends HTMLElement {
      @tagName static tag = 'element-1';

      @attr accessor value1 = 'hello'; // no attribute
      @attr accessor value2 = 0; // number
      @attr accessor value3 = true; // boolean
    }

    const el = await fixture<MyElement>(html`<element-1></element-1>`);

    expect(el.getAttribute('value1')).to.equal('hello');
    expect(el.getAttribute('value2')).to.equal('0');
    expect(el.getAttribute('value3')).to.equal('');
  });
});
