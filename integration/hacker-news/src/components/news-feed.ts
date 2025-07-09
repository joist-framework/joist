import { inject, injectable, injected } from "@joist/di";
import { css, element, html } from "@joist/element";
import { bind } from "@joist/templating";

import { type HnItem, HnService } from "../services/hn.service.js";

@injectable()
@element({
  tagName: "hn-news-feed",
  shadowDom: [
    css`
      :host {
        display: contents;
      }

      .loading-container {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4rem;
      }
    `,
    html`
      <j-if bind="isLoading">
        <template>
          <div class="loading-container">
            <hn-loading></hn-loading>
          </div>
        </template>

        <template else>
          <j-for bind="stories" key="id">
            <template>
              <j-bind
                props="
              number:each.position, 
              author:each.value.by, 
              comments:each.value.descendants, 
              points:each.value.score, 
              href:each.value.url
            "
              >
                <hn-news-card>
                  <j-val bind="each.value.title"></j-val>
                </hn-news-card>
              </j-bind>
            </template>
          </j-for>
        </template>
      </j-if>
    `,
  ],
})
export class HnNewsFeed extends HTMLElement {
  #hn = inject(HnService);

  @bind()
  accessor stories: HnItem[] = [];

  @bind()
  accessor isLoading = true;

  @injected()
  async onInjected() {
    const hn = this.#hn();

    this.stories = await hn.getTopStories();
    this.isLoading = false;
  }
}
