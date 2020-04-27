import { ElementInstance } from '@joist/component';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let el: ElementInstance<AppComponent>;

  beforeEach(() => {
    el = document.createElement('app-root') as ElementInstance<AppComponent>;

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
