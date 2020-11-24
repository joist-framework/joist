import { defineTestBed } from '@joist/component/testing';
import { Injector } from '@joist/di';
import { expect } from '@open-wc/testing';

import { LoaderElement } from './loader.element';

describe('TodoFormElement', () => {
  let el: LoaderElement;

  beforeEach(() => {
    el = defineTestBed().get(LoaderElement);
  });

  it('should work', () => {
    expect(el.injector).instanceOf(Injector);
  });
});
