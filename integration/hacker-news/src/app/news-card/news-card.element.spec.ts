import { defineTestBed } from '@joist/component/testing';
import { Injector } from '@joist/di';
import { expect } from '@open-wc/testing';

import { NewsCardElement } from './news-card.element';

describe('TodoFormElement', () => {
  let el: NewsCardElement;

  beforeEach(() => {
    el = defineTestBed().get(NewsCardElement);
  });

  it('should work', () => {
    expect(el.injector).instanceOf(Injector);
  });
});
