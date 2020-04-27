import { ElementInstance } from '@joist/component';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let el: ElementInstance<AppComponent>;

  beforeEach(() => {
    el = document.createElement('app-root') as ElementInstance<AppComponent>;
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
