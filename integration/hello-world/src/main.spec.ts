import { expect } from '@open-wc/testing';

import { AppElement } from './main';

describe('AppElement', () => {
  let el: AppElement;

  beforeEach(() => {
    el = new AppElement();

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should have the correct title', () => {
    const title = el.querySelector('h1');

    expect(title!.innerHTML).to.equal('Hello World');
  });
});
