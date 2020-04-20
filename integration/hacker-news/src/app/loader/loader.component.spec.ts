import { ElementInstance } from '@lit-kit/component';

import { LoaderComponent } from './loader.component';

describe('LoaderComponent', () => {
  let el: ElementInstance<LoaderComponent>;

  beforeEach(() => {
    el = document.createElement('app-loader') as ElementInstance<LoaderComponent>;
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
