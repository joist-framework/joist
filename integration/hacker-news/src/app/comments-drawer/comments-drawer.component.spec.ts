import { ElementInstance } from '@joist/component';

import { CommentsDrawerComponent } from './comments-drawer.component';

describe('LoaderComponent', () => {
  let el: ElementInstance<CommentsDrawerComponent>;

  beforeEach(() => {
    el = document.createElement('app-loader') as ElementInstance<CommentsDrawerComponent>;
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
