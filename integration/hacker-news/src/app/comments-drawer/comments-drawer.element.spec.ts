import { CommentsDrawerElement } from './comments-drawer.element';

describe('TodoFormElement', () => {
  let el: CommentsDrawerElement;

  beforeEach(() => {
    el = new CommentsDrawerElement();

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should work', () => {
    expect(el.injector).toBeTruthy();
  });
});
