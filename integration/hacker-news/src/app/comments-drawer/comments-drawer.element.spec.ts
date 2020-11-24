import { defineTestBed } from '@joist/component/testing';
import { Injector } from '@joist/di';
import { expect } from '@open-wc/testing';

import { CommentsDrawerElement } from './comments-drawer.element';

describe('TodoFormElement', () => {
  let el: CommentsDrawerElement;

  beforeEach(() => {
    el = defineTestBed().get(CommentsDrawerElement);
  });

  it('should work', () => {
    expect(el.injector).instanceOf(Injector);
  });
});
