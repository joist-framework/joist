import { inject, injectable, injected } from "@joist/di";
import { css, element, html } from "@joist/element";

import { bind } from "@joist/observable/dom.js";
import { type HnItem, HnService } from "../services/hn.service.js";

@injectable()
@element({
  tagName: "hn-news-feed",
  shadowDom: [
    css`
      :host {
        display: contents;
      }
    `,
    html`
      <j-for bind="stories">
        <template>
          <j-props #by:author #descendants:comments #score:points #url:href>
            <hn-news-card>
              <j-value bind="title"></j-value>
            </hn-news-card>
          </j-props>
        </template>
      </j-for>
    `,
  ],
})
export class HnNewsFeed extends HTMLElement {
  #hn = inject(HnService);

  @bind()
  accessor stories: HnItem[] | null = null;

  @injected()
  async onInjected() {
    const hn = this.#hn();

    this.stories = await hn.getTopStories();
  }
}
