import { ElementInstance } from '@lit-kit/component';

import { NewsCardComponent, NewsCardState } from './news-card.component';

describe('AppComponent', () => {
  let el: ElementInstance<NewsCardComponent, NewsCardState>;

  beforeEach(() => {
    el = document.createElement('app-root') as ElementInstance<NewsCardComponent, NewsCardState>;
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
