import { ElementInstance } from '@joist/component';

import { AppElement } from './app.component';

describe('AppComponent', () => {
  let el: ElementInstance<AppElement>;

  beforeEach(() => {
    el = document.createElement('app-root') as ElementInstance<AppElement>;
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
