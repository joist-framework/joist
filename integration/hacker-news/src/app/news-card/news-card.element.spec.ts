import { Injector } from '@joist/di';
import { expect } from '@open-wc/testing';

import { NewsCardElement } from './news-card.element';

describe('NewsCardElement', () => {
  let el: NewsCardElement;

  beforeEach(() => {
    el = new NewsCardElement();

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should work', () => {
    expect(el.injector).instanceOf(Injector);
  });
});
