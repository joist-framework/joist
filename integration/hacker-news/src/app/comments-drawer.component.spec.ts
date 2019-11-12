import { createComponent, ElementInstance } from '@lit-kit/component';

import { CommentsDrawerComponent, CommentsDrawerState } from './comments-drawer.component';

describe('NewsCard', () => {
  let el: ElementInstance<CommentsDrawerComponent, CommentsDrawerState>;

  beforeEach(() => {
    el = createComponent(CommentsDrawerComponent);
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
