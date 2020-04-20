import { ElementInstance } from '@lit-kit/component';

import { CommentsDrawerState, CommentsDrawerComponent } from './comments-drawer.component';

describe('LoaderComponent', () => {
  let el: ElementInstance<CommentsDrawerComponent, CommentsDrawerState>;

  beforeEach(() => {
    el = document.createElement('app-loader') as ElementInstance<
      CommentsDrawerComponent,
      CommentsDrawerState
    >;
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
