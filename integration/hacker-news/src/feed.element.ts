import { Injected, injectable } from '@joist/di';
import { css, tagName, html, styles, template } from '@joist/element';

import { HnService } from './hn.service.js';
import { HNFeedItemElement } from './feed-item.element.js';

@injectable
export class HNFeedElement extends HTMLElement {
  @tagName static tagName = 'hn-feed';

  static inject = [HnService];

  @styles styles = css`
    :host {
      display: contents;
    }
  `;

  @template template = html`<slot></slot>`;

  #hn: Injected<HnService>;

  constructor(hn: Injected<HnService>) {
    super();

    this.#hn = hn;
  }

  connectedCallback() {
    this.#hn()
      .getFrontPage()
      .then((res) => {
        console.log(res);

        res.hits.forEach((item) => {
          const el = HNFeedItemElement.from(item);
          this.append(el);
        });
      });
  }
}
