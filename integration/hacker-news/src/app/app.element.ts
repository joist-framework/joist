import './loader/loader.element';

import { Component, State, Handle, OnConnected, JoistElement, Get } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';
import { until } from 'lit-html/directives/until';

import { HackerNewsService, HackerNewsItem, HackerNewsItemFull } from './hacker-news.service';

export interface AppState {
  loadingNews: boolean;
  news: HackerNewsItem[];
  loadingCurrentNewsItem: boolean;
  currentNewsItem?: HackerNewsItemFull;
}

@Component<AppState>({
  state: {
    loadingNews: false,
    news: [],
    loadingCurrentNewsItem: false,
  },
  render: template(({ state, run }) => {
    return html`
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

      ${state.loadingNews || state.loadingCurrentNewsItem ? html` <app-loader></app-loader> ` : ''}

      <div class="cards">
        ${state.news.map((news) =>
          until(
            import('./news-card/news-card.element').then(
              () =>
                html`
                  <news-card .newsItem=${news} @click=${run('CARD_CLICKED', news)}></news-card>
                `
            ),
            html`<div class="placeholder-card"></div>`
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
  }),
})
export class AppElement extends JoistElement implements OnConnected {
  @Get(State)
  private state!: State<AppState>;

  @Get(HackerNewsService)
  private hackerNews!: HackerNewsService;

  connectedCallback(): void {
    this.state.patchValue({ loadingNews: true });

    const state = this.hackerNews.getNews().then((news) => ({ news, loadingNews: false }));

    this.state.patchValue(state);
  }

  @Handle('CARD_CLICKED') onCardClicked(_: Event, news: HackerNewsItemFull): void {
    this.state.patchValue({ loadingCurrentNewsItem: true });

    const state = this.hackerNews.getNewsItem(news.id).then((currentNewsItem) => ({
      currentNewsItem,
      loadingCurrentNewsItem: false,
    }));

    this.state.patchValue(
      Promise.all([state, import('./comments-drawer/comments-drawer.element')]).then(
        ([state]) => state
      )
    );
  }

  @Handle('CLOSE_DRAWER') onCloseDrawer(_: CustomEvent): void {
    this.state.patchValue({ currentNewsItem: undefined });
  }
}

customElements.define('app-root', AppElement);
