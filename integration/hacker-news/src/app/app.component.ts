import './loader/loader.component';

import { Component, StateRef, State, OnInit, Handle } from '@lit-kit/component';
import { html } from 'lit-html';
import { until } from 'lit-html/directives/until';

import {
  HackerNewsService,
  HackerNewsItem,
  HackerNewsRef,
  HackerNewsItemFull
} from './hacker-news.service';

export interface AppState {
  loadingNews: boolean;
  news: HackerNewsItem[];
  loadingCurrentNewsItem: boolean;
  currentNewsItem?: HackerNewsItemFull;
}

@Component<AppState>({
  tag: 'app-root',
  defaultState: { loadingNews: false, news: [], loadingCurrentNewsItem: false },
  style: html`
    <style>
      :host {
        display: block;
        max-width: 1200px;
        margin: 0 auto;
        padding-top: var(--header-height);
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        overflow-y: auto;
      }

      news-card,
      .placeholder-card {
        margin-bottom: 0.75rem;
      }

      app-loader {
        position: fixed;
        top: 24px;
        z-index: 1000;
        right: 24px;
      }

      .placeholder-card {
        background: rgba(255, 255, 255, 0.8);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        height: 130px;
      }

      comments-drawer {
        animation: drawerEnter 0.2s;
        max-width: 1200px;
        margin: 0 auto;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        z-index: 1001;
      }

      @keyframes drawerEnter {
        0% {
          transform: translateY(100%);
        }
        100% {
          transform: translateY(0);
        }
      }
    </style>
  `,
  template(state, run) {
    return html`
      ${state.loadingNews || state.loadingCurrentNewsItem
        ? html`
            <app-loader></app-loader>
          `
        : ''}

      <div class="cards">
        ${state.news.map(news =>
          until(
            import('./news-card/news-card.component').then(
              () =>
                html`
                  <news-card .newsItem=${news} @click=${run('CARD_CLICKED', news)}></news-card>
                `
            ),
            html`
              <div class="placeholder-card"></div>
            `
          )
        )}
      </div>

      ${state.currentNewsItem
        ? html`
            <comments-drawer
              .comments=${state.currentNewsItem.comments}
              @close_drawer=${run('CLOSE_DRAWER')}
            ></comments-drawer>
          `
        : ''}
    `;
  }
})
export class AppComponent implements OnInit {
  constructor(
    @StateRef() private state: State<AppState>,
    @HackerNewsRef() private hackerNews: HackerNewsService
  ) {}

  onInit(): void {
    this.state.setState({ ...this.state.value, loadingNews: true });

    const state: Promise<AppState> = this.hackerNews
      .getNews()
      .then(news => ({ ...this.state.value, news, loadingNews: false }));

    this.state.setState(state);
  }

  @Handle('CARD_CLICKED') onCardClicked(_: Event, news: HackerNewsItemFull): void {
    this.state.setState({ ...this.state.value, loadingCurrentNewsItem: true });

    const state: Promise<AppState> = this.hackerNews.getNewsItem(news.id).then(currentNewsItem => ({
      ...this.state.value,
      currentNewsItem,
      loadingCurrentNewsItem: false
    }));

    this.state.setState(
      Promise.all([state, import('./comments-drawer/comments-drawer.component')]).then(
        res => res[0]
      )
    );
  }

  @Handle('CLOSE_DRAWER') onCloseDrawer(_: CustomEvent): void {
    this.state.setState({ ...this.state.value, currentNewsItem: undefined });
  }
}
