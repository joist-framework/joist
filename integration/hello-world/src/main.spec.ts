import { expect } from '@open-wc/testing';
import { defineTestBed } from '@joist/component/testing';

import { AppElement } from './main';

describe('AppElement', () => {
  let el: AppElement;

  beforeEach(() => {
    el = defineTestBed().create(AppElement);
  });

  it('should have the correct title', () => {
    const title = el.querySelector('h1');

    expect(title!.innerHTML).to.equal('Hello World');
  });
});
