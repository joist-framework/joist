import { createComponent, ElementInstance } from '@lit-kit/component';

import { AppComponent, AppState } from './app.component';

describe('AppComponent', () => {
  let el: ElementInstance<AppComponent, AppState>;

  beforeEach(() => {
    el = createComponent(AppComponent);

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
