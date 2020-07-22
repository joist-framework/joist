import { Injector } from '@joist/di';

import './comments-drawer.element';
import { CommentsDrawerElement } from './comments-drawer.element';

describe('TodoFormElement', () => {
  let el: CommentsDrawerElement;

  beforeEach(() => {
    el = document.createElement('comments-drawer') as CommentsDrawerElement;

    el.injector.parent = new Injector();

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should work', () => {
    expect(el.injector).toBeTruthy();
  });
});
