import { expect, fixture, html } from '@open-wc/testing';
import { render } from 'lit-html';

import { attr } from './attr.js';
import { element } from './element.js';
import { css, html as joistHtml } from './tags.js';

describe('@element()', () => {
  it('should write default value to attribute', async () => {
    @element({
      tagName: 'element-1'
    })
    class MyElement extends HTMLElement {
      @attr()
      accessor value1 = 'hello'; // no attribute

      @attr()
      accessor value2 = 0; // number

      @attr()
      accessor value3 = true; // boolean
    }

    const el = await fixture<MyElement>(html`<element-1></element-1>`);

    expect(el.getAttribute('value1')).to.equal('hello');
    expect(el.getAttribute('value2')).to.equal('0');
    expect(el.getAttribute('value3')).to.equal('');
  });

  it('should register attributes', async () => {
    @element({
      tagName: 'element-2',
      shadow: true,
      template: [
        css`
          :host {
            display: contents;
          }
        `,
        joistHtml/*html*/ `
          <slot></slot>
        `
      ]
    })
    class MyElement extends HTMLElement {
      @attr()
      accessor value1 = 'hello'; // no attribute

      @attr()
      accessor value2 = 0; // number

      @attr()
      accessor value3 = true; // boolean
    }

    expect(Reflect.get(MyElement, 'observedAttributes')).to.deep.equal([
      'value1',
      'value2',
      'value3'
    ]);
  });
});
