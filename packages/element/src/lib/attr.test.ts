import { test, expect } from 'vitest';

import { attr } from './attr.js';
import { element } from './element.js';

test('should read and parse the correct values', () => {
  @element({
    tagName: 'attr-test-1'
  })
  class MyElement extends HTMLElement {
    @attr()
    accessor value1 = 100; // no attribute

    @attr()
    accessor value2 = 0; // number

    @attr()
    accessor value3 = false; // boolean

    @attr()
    accessor value4 = 'hello'; // string
  }

  const container = document.createElement('div');
  container.innerHTML = /*html*/ `
    <attr-test-1 value2="2" value3 value4="world"></attr-test-1>
  `;

  document.body.append(container);

  const el = document.querySelector('attr-test-1') as MyElement;

  expect(el.value1).to.equal(100);
  expect(el.value2).to.equal(2);
  expect(el.value3).to.equal(true);
  expect(el.value4).to.equal('world');

  container.remove();
});

test('should not write falsy props to attributes', async () => {
  @element({
    tagName: 'attr-test-2'
  })
  class MyElement extends HTMLElement {
    @attr()
    accessor value1 = undefined;

    @attr()
    accessor value2 = null;

    @attr()
    accessor value3 = '';
  }

  const el = new MyElement();

  expect(el.hasAttribute('value1')).to.be.false;
  expect(el.hasAttribute('value2')).to.be.false;
  expect(el.hasAttribute('value3')).to.be.false;
});

test('should update attributes when props are changed', async () => {
  @element({
    tagName: 'attr-test-3'
  })
  class MyElement extends HTMLElement {
    @attr()
    accessor value1 = 'hello'; // no attribute

    @attr()
    accessor value2 = 0; // number

    @attr()
    accessor value3 = true; // boolean

    @attr()
    accessor value4 = false; // boolean
  }

  const el = new MyElement();

  el.value1 = 'world';
  el.value2 = 100;
  el.value3 = false;
  el.value4 = true;

  expect(el.getAttribute('value1')).to.equal('world');
  expect(el.getAttribute('value2')).to.equal('100');
  expect(el.hasAttribute('value3')).to.be.false;
  expect(el.hasAttribute('value4')).to.be.true;
});

test('should normalize attribute names', async () => {
  const value3 = Symbol('Value from SYMBOL');

  @element({
    tagName: 'attr-test-4'
  })
  class MyElement extends HTMLElement {
    @attr()
    accessor Value1 = 'hello';

    @attr()
    accessor ['Value 2'] = 0;

    @attr()
    accessor [value3] = true;
  }

  const el = new MyElement();

  document.body.append(el);

  expect([...el.attributes].map((attr) => attr.name)).to.deep.equal([
    'value1',
    'value-2',
    'value-from-symbol'
  ]);

  el.remove();
});

test('should throw an error for symbols with no description', async () => {
  expect(() => {
    const value = Symbol();

    @element({
      tagName: 'attr-test-4'
    })
    class MyElement extends HTMLElement {
      @attr()
      accessor [value] = true;
    }

    new MyElement();
  }).to.throw('Cannot handle Symbol property without description');
});
