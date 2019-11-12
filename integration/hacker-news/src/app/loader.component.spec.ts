import { createComponent, ElementInstance } from '@lit-kit/component';

import { LoaderComponent } from './loader.component';

describe('LoaderComponent', () => {
  let el: ElementInstance<LoaderComponent, void>;

  beforeEach(() => {
    el = createComponent(LoaderComponent);
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
