import { injectable } from '@joist/di';
import { css, tagName, html, styles, template } from '@joist/element';

@injectable
export class HNFeedElement extends HTMLElement {
  @tagName static tagName = 'hn-feed-item';

  @styles styles = css``;

  @template template = html`<h1>Hello World</h1>`;
}
