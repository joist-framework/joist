import { css, tagName, html, shadow, attr } from '@joist/element';
import { FeedItem } from './hn.service';

export class HNFeedItemElement extends HTMLElement {
  static from(item: FeedItem) {
    const el = new HNFeedItemElement();

    el.points = el.points;
    el.url = item.url;
    el.comments = item.num_comments;

    el.innerHTML = item.title;

    return el;
  }

  @tagName static tagName = 'hn-feed-item';

  @shadow styles = css`
    :host {
      display: block;
    }
  `;

  @shadow template = html`<slot></slot>`;

  @attr accessor points = 0;
  @attr accessor url = '';
  @attr accessor comments = 0;
}
