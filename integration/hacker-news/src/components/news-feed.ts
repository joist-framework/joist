import './loading.js';
import './news-card.js';

import { css, element, html, query } from '@joist/element';
import { inject, injectable } from '@joist/di';

import { HnService } from '../services/hn.service.js';
import { HnNewsCard } from './news-card.js';
import { HnLoadingElement } from './loading.js';

@injectable()
@element({
  tagName: 'hn-news-feed',
  shadow: [
    css`
      :host {
        display: contents;
      }

      hn-loading {
        margin: 2rem auto auto auto;
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
  #loading = query<HnLoadingElement>('hn-loading');

  async connectedCallback() {
    const hn = this.#hn();

    const stories = await hn.getTopStories();

    let number = 1;

    for (let value of stories) {
      const card = document.createElement('hn-news-card') as HnNewsCard;

      card.number = number;
      card.innerHTML = value.title;
      card.author = value.by;
      card.comments = value.kids.length;
      card.points = value.score;
      card.href = value.url ?? '';

      this.append(card);

      number++;
    }

    this.#loading().remove();
  }
}
