import { createComponent, ElementInstance } from '@lit-kit/component';

import { AppComponent, AppState } from './app.component';

describe('AppComponent', () => {
  let el: ElementInstance<AppComponent, AppState>;

  beforeEach(() => {
    el = createComponent(AppComponent);
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
