import { expect, assert } from 'chai';

import { attr } from './attr.js';
import { element } from './element.js';
import { css, html } from './tags.js';

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

    @attr({ reflect: false })
    accessor value4 = 'foo';
  }

  const el = new MyElement();

  document.body.append(el);

  expect(el.getAttribute('value1')).to.equal('hello');
  expect(el.getAttribute('value2')).to.equal('0');
  expect(el.getAttribute('value3')).to.equal('');
  expect(el.getAttribute('value4')).to.equal(null);

  el.remove();
});

// TODO: Figure out test
// it('should register attributes', async () => {
//   @element({
//     tagName: 'element-2'
//   })
//   class MyElement extends HTMLElement {
//     @attr()
//     accessor value1 = 'hello'; // no attribute

//     @attr()
//     accessor value2 = 0; // number

//     @attr()
//     accessor value3 = true; // boolean

//     @attr({ observed: false }) // should be filtered out
//     accessor value4 = 'hello world';
//   }

//   expect(Reflect.get(MyElement, 'observedAttributes')).to.deep.equal([
//     'value1',
//     'value2',
//     'value3'
//   ]);
// });

it('should attach shadow root when the shadow property exists', async () => {
  @element({
    tagName: 'element-3',
    shadowDom: []
  })
  class MyElement extends HTMLElement {}

  const el = new MyElement();

  expect(el.shadowRoot).to.be.instanceOf(ShadowRoot);
});

it('should apply html and css', async () => {
  @element({
    tagName: 'element-4',
    shadowDom: [
      css`
        :host {
          display: contents;
        }
      `,
      html`<slot></slot>`,
      {
        apply(el) {
          const div = document.createElement('div');
          div.innerHTML = 'hello world';

          el.append(div);
        }
      }
    ]
  })
  class MyElement extends HTMLElement {}

  const el = new MyElement();

  expect(el.shadowRoot!.adoptedStyleSheets.length).to.equal(1);
  expect(el.shadowRoot!.innerHTML).to.equal(`<slot></slot>`);
  expect(el.innerHTML).to.equal(`<div>hello world</div>`);
});

it('should the correct shadow dom mode', async () => {
  @element({
    tagName: 'element-5',
    shadowDom: [],
    shadowDomOpts: {
      mode: 'closed'
    }
  })
  class MyElement extends HTMLElement {}

  const el = new MyElement();

  assert.equal(el.shadowRoot, null);
});
