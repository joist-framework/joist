import { Component, StateRef, State, Prop, OnPropChanges } from '@lit-kit/component';
import { html } from 'lit-html';

import { HackerNewsItem } from '../hacker-news.service';

export type NewsCardState = HackerNewsItem | null;

@Component<NewsCardState>({
  tag: 'news-card',
  initialState: null,
  useShadowDom: true,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem 1.5rem;
        background: #fff;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }

      .card-content {
        color: gray;
      }

      h3 {
        font-size: 1.1rem;
        margin: 0 0 1.5rem 0;
      }

      h3 a {
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-decoration: underline;
      }

      a,
      a:hover,
      a:active,
      a:visited {
        color: #000;
        cursor: pointer;
        text-decoration: none;
      }
    `
  ],
  template(state, _run) {
    if (!state) {
      return html``;
    }

    return html`
      <h3>
        <a href=${state.url}>${state.title}</a>
      </h3>

      <div class="card-content">
        <p>${state.points} <b>points</b> by <b>${state.user}</b> ${state.time_ago}</p>

        ${state.comments_count} comments
      </div>
    `;
  }
})
export class NewsCardComponent implements OnPropChanges {
  @Prop() newsItem: NewsCardState = null;

  constructor(@StateRef private state: State<NewsCardState>) {}

  onPropChanges() {
    this.state.setValue(this.newsItem);
  }
}
