import '../loading/loading.js';
import '../news-card/news-card.js';

import { css, element, html, query } from '@joist/element';
import { inject, injectable } from '@joist/di';

import { HnService } from '../services/hn.service.js';
import { HnNewsCard } from '../news-card/news-card.js';

@injectable()
@element({
  tagName: 'hn-news-feed',
  shadow: [
    css`
      :host {
        display: contents;
      }

      hn-loading {
        margin: 1rem auto 1rem auto;
      }
    `,
    html`
      <hn-loading></hn-loading>

      <slot></slot>
    `
  ]
})
export class HnNewsFeed extends HTMLElement {
  #hn = inject(HnService);
  #loading = query('hn-loading');

  connectedCallback() {
    const hn = this.#hn();

    hn.getTopStories().then((res) => {
      let number = 1;

      for (let item of res) {
        const card = document.createElement('hn-news-card') as HnNewsCard;

        card.number = number;
        card.innerHTML = item.title;
        card.author = item.by;
        card.comments = item.kids.length;
        card.points = item.score;

        if (item.url) {
          card.href = item.url;
        }

        this.append(card);

        number++;
      }

      this.#loading().remove();
    });
  }
}
