import { AppElement } from './app.element';

describe('AppComponent', () => {
  let el: AppElement;

  beforeEach(() => {
    el = document.createElement('app-root') as AppElement;

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
