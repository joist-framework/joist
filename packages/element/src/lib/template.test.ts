import { assert } from 'chai';

import { template } from './template.js';

// Run all tests with both shadow and light dom
const TESTS = [
  function comments(el: HTMLElement, root: HTMLElement | ShadowRoot) {
    it(`should intialize bindable nodes ${root instanceof ShadowRoot ? '(ShadowDOM)' : '(LightDOM)'}`, () => {
      el.title = 'Hello World';
      el.ariaLabel = 'This is the label';
      el.ariaDescription = 'This is the description';

      root.innerHTML = /*html*/ `
        <span #:bind="title"></span>
        
        <ul>
          <li><span #:bind="ariaLabel"></span></li>
          <li><span #:bind="ariaDescription"></span></li>
        </ul>
      `;

      const render = template();

      render.call(el);

      assert.equal(
        root.innerHTML
          .split('\n')
          .map((res) => res.trim())
          .join(''),
        '<span #:bind="title">Hello World</span><ul><li><span #:bind="ariaLabel">This is the label</span></li><li><span #:bind="ariaDescription">This is the description</span></li></ul>'
      );
    });
  },
  function attributes(el: HTMLElement, root: HTMLElement | ShadowRoot) {
    it(`should intialize template attributes ${root instanceof ShadowRoot ? '(ShadowDOM)' : '(LightDOM)'}`, () => {
      el.ariaLabel = 'This is the label';
      el.ariaDescription = 'This is the description';

      root.innerHTML = /*html*/ `
        <ul aria-label="#:ariaLabel" aria-description="#:ariaDescription"></ul>
      `;

      const render = template();

      render.call(el);

      assert.equal(
        root.innerHTML
          .split('\n')
          .map((res) => res.trim())
          .join(''),
        '<ul aria-label="This is the label" aria-description="This is the description"></ul>'
      );
    });
  }
];

for (let test of TESTS) {
  const lightEl = document.createElement('div');
  test(lightEl, lightEl);

  const shadowEl = document.createElement('div');
  test(shadowEl, shadowEl.attachShadow({ mode: 'open' }));
}
