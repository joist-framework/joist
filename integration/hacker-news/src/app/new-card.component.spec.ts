import { createComponent, ElementInstance } from '@lit-kit/component';

import { NewsCardComponent, NewsCardState } from './news-card.component';

describe('NewsCard', () => {
  let el: ElementInstance<NewsCardComponent, NewsCardState>;

  beforeEach(() => {
    el = createComponent(NewsCardComponent);
  });

  it('should work', () => {
    expect(el).toBeTruthy();
  });
});
