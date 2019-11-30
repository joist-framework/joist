import { createComponent, ElementInstance } from '@lit-kit/component';

import { RouterLinkComponent, RouterLinkState } from './router-link.component';

describe('RouterLinkComponent', () => {
  let el: ElementInstance<RouterLinkComponent, RouterLinkState>;

  beforeEach(() => {
    el = createComponent(RouterLinkComponent);

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
