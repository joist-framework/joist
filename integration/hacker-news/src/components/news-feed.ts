import { css, element, html } from '@joist/element';
import { inject, injectable, created } from '@joist/di';

import { HnService } from '../services/hn.service.js';
import { HnNewsCard } from './news-card.js';

@injectable()
@element({
  tagName: 'hn-news-feed',
  shadowDom: [
    css`
      :host {
        display: contents;
      }
    `,
    html`<slot></slot>`
  ]
})
export class HnNewsFeed extends HTMLElement {
  #hn = inject(HnService);

  @created()
  async onInjected() {
    console.log('TEST');
    const hn = this.#hn();

    const stories = await hn.getTopStories();

    this.innerHTML = '';

    let number = 1;

    for (let value of stories) {
      const card = new HnNewsCard();

      card.number = number;
      card.textContent = value.title;
      card.author = value.by;
      card.comments = value.kids.length;
      card.points = value.score;
      card.href = value.url ?? '';

      this.append(card);

      number++;
    }
  }
}
