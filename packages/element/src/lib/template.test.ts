import { assert } from 'chai';

import { template } from './template.js';

// Run all tests with both shadow and light dom
const TESTS = [
  function bindableNodes(el: HTMLElement, root: HTMLElement | ShadowRoot) {
    it(`should intialize bindable nodes ${root instanceof ShadowRoot ? '(ShadowDOM)' : '(LightDOM)'}`, () => {
      el.title = 'Hello World';
      el.ariaLabel = 'This is the label';
      el.ariaDescription = 'This is the description';

      root.innerHTML = /*html*/ `
        <span #:bind="title"></span>
        
        <ul>
          <li #:bind="ariaLabel"></li>
          <li #:bind="ariaDescription"></li>
        </ul>
      `;

      const render = template().bind(el);

      render();

      assert.equal(
        root.innerHTML
          .split('\n')
          .map((res) => res.trim())
          .join(''),
        '<span #:bind="title">Hello World</span><ul><li #:bind="ariaLabel">This is the label</li><li #:bind="ariaDescription">This is the description</li></ul>'
      );
    });
  },
  function attributeNodes(el: HTMLElement, root: HTMLElement | ShadowRoot) {
    it(`should intialize template attributes ${root instanceof ShadowRoot ? '(ShadowDOM)' : '(LightDOM)'}`, () => {
      el.ariaLabel = 'This is the label';
      el.ariaDescription = 'This is the description';

      root.innerHTML = /*html*/ `
        <ul #:aria-label="ariaLabel" #:aria-description="ariaDescription"></ul>
      `;

      const render = template().bind(el);

      render();

      assert.equal(
        root.innerHTML
          .split('\n')
          .map((res) => res.trim())
          .join(''),
        '<ul #:aria-label="ariaLabel" #:aria-description="ariaDescription" aria-label="This is the label" aria-description="This is the description"></ul>'
      );
    });
  },
  function customGetter(el: HTMLElement, root: HTMLElement | ShadowRoot) {
    it(`should use custom getter for values ${root instanceof ShadowRoot ? '(ShadowDOM)' : '(LightDOM)'}`, () => {
      const data: Record<string, string> = {
        title: 'Hello World',
        ariaLabel: 'This is the label',
        ariaDescription: 'This is the description'
      };

      root.innerHTML = /*html*/ `
        <span #:bind="title"></span>
        
        <ul>
          <li #:bind="ariaLabel"></li>
          <li #:bind="ariaDescription"></li>
        </ul>
      `;

      const render = template({ value: (key) => data[key] }).bind(el);

      render();

      assert.equal(
        root.innerHTML
          .split('\n')
          .map((res) => res.trim())
          .join(''),
        '<span #:bind="title">Hello World</span><ul><li #:bind="ariaLabel">This is the label</li><li #:bind="ariaDescription">This is the description</li></ul>'
      );
    });
  },
  function customPrefix(el: HTMLElement, root: HTMLElement | ShadowRoot) {
    it(`should use custom getter for values ${root instanceof ShadowRoot ? '(ShadowDOM)' : '(LightDOM)'}`, () => {
      el.title = 'Hello World';
      el.ariaLabel = 'This is the label';
      el.ariaDescription = 'This is the description';

      root.innerHTML = /*html*/ `
        <span x-bind="title"></span>
        
        <ul x-aria-label="ariaLabel">
          <li x-bind="ariaLabel"></li>
          <li x-bind="ariaDescription"></li>
        </ul>
      `;

      const render = template({ tokenPrefix: 'x-' }).bind(el);

      render();

      assert.equal(
        root.innerHTML
          .split('\n')
          .map((res) => res.trim())
          .join(''),
        '<span x-bind="title">Hello World</span><ul x-aria-label="ariaLabel" aria-label="This is the label"><li x-bind="ariaLabel">This is the label</li><li x-bind="ariaDescription">This is the description</li></ul>'
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
