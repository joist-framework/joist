import { ElementInstance } from '@lit-kit/component';

import { NewsCardComponent } from './news-card.component';

describe('AppComponent', () => {
  let el: ElementInstance<NewsCardComponent>;

  beforeEach(() => {
    el = document.createElement('app-root') as ElementInstance<NewsCardComponent>;
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
