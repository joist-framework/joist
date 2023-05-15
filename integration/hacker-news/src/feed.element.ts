import { Injected, injectable } from '@joist/di';
import { css, tagName, html, styles, template } from '@joist/element';

import { HnService } from './hn.service.js';

@injectable
export class HNFeedElement extends HTMLElement {
  @tagName static tagName = 'hn-feed';

  static inject = [HnService];

  @styles styles = css``;

  @template template = html`<h1>Hello World</h1>`;

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
      });
  }
}
