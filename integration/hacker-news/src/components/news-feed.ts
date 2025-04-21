import { inject, injectable, injected } from "@joist/di";
import { css, element, html } from "@joist/element";

import { HnService } from "../services/hn.service.js";
import { HnNewsCard } from "./news-card.js";

@injectable()
@element({
  tagName: "hn-news-feed",
  shadowDom: [
    css`
      :host {
        display: contents;
      }
    `,
    html`<slot></slot>`,
  ],
})
export class HnNewsFeed extends HTMLElement {
  #hn = inject(HnService);

  @injected()
  async onInjected() {
    const hn = this.#hn();

    const stories = await hn.getTopStories();
    const fragment = document.createDocumentFragment();

    let number = 1;

    for (const value of stories) {
      const card = new HnNewsCard();

      card.number = number;
      card.textContent = value.title;
      card.author = value.by;
      card.comments = value.kids.length;
      card.points = value.score;
      card.href = value.url ?? "";

      fragment.append(card);

      number++;
    }

    this.replaceChildren(fragment);
  }
}
