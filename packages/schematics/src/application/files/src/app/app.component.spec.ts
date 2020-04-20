import { ElementInstance } from '@lit-kit/component';

import { AppComponent, AppState } from './app.component';

describe('AppComponent', () => {
  let el: ElementInstance<AppComponent, AppState>;

  beforeEach(() => {
    el = document.createElement('app-root') as ElementInstance<AppComponent, AppState>;

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
