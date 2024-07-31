import { expect, fixture, html as litHtml } from '@open-wc/testing';

import { attr } from './attr.js';
import { element } from './element.js';
import { css, html } from './tags.js';
// import { css, html } from './tags.js';

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

    const el = await fixture<MyElement>(litHtml`<element-1></element-1>`);

    expect(el.getAttribute('value1')).to.equal('hello');
    expect(el.getAttribute('value2')).to.equal('0');
    expect(el.getAttribute('value3')).to.equal('');
  });

  it('should register attributes', async () => {
    @element({
      tagName: 'element-2'
    })
    class MyElement extends HTMLElement {
      @attr()
      accessor value1 = 'hello'; // no attribute

      @attr()
      accessor value2 = 0; // number

      @attr()
      accessor value3 = true; // boolean

      @attr({ observe: false }) // should be filtered out
      accessor value4 = 'hello world';
    }

    expect(Reflect.get(MyElement, 'observedAttributes')).to.deep.equal([
      'value1',
      'value2',
      'value3'
    ]);
  });

  it('should attach shadow root when the shadow property exists', async () => {
    @element({
      tagName: 'element-3',
      shadow: []
    })
    class MyElement extends HTMLElement {}

    const el = new MyElement();

    expect(el.shadowRoot).to.be.instanceOf(ShadowRoot);
  });

  it('should apply html and css', async () => {
    @element({
      tagName: 'element-4',
      shadow: [
        css`
          :host {
            display: contents;
          }
        `,
        html`<slot></slot>`
      ]
    })
    class MyElement extends HTMLElement {}

    const el = new MyElement();

    expect(el.shadowRoot!.adoptedStyleSheets.length).to.equal(1);
    expect(el.shadowRoot!.innerHTML).to.equal(`<slot></slot>`);
  });
});
