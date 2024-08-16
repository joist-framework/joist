import { assert } from 'chai';

import { template } from './template.js';

// Run all tests with both shadow and light dom
const TESTS = [
  function comments(el: HTMLElement, root: HTMLElement | ShadowRoot) {
    it(`should intialize template comments ${root instanceof ShadowRoot ? '(ShadowDOM)' : '(LightDOM)'}`, () => {
      el.title = 'Hello World';
      el.ariaLabel = 'This is the label';
      el.ariaDescription = 'This is the description';

      root.innerHTML = /*html*/ `
        <!--#:title-->
        
        <ul>
          <li><!--#:ariaLabel--></li>
          <li><!--#:ariaDescription--></li>
        </ul>
      `;

      const render = template();

      render.call(el);

      assert.equal(
        root.innerHTML
          .split('\n')
          .map((res) => res.trim())
          .join(''),
        'Hello World<ul><li>This is the label</li><li>This is the description</li></ul>'
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
