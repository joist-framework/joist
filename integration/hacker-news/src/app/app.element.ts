import { component, State, handle, JoistElement, get, RenderCtx } from '@joist/component';
import { template, html } from '@joist/component/lit-html';

import { HackerNewsService, HackerNewsItem, HackerNewsItemFull } from './hacker-news.service';

export interface AppState {
  loadingNews: boolean;
  news: HackerNewsItem[];
  loadingCurrentNewsItem: boolean;
  currentNewsItem?: HackerNewsItemFull;
}

function createNewsCards({ state, run }: RenderCtx<AppState>) {
  return state.news.map(
    (news) => html`<news-card .newsItem=${news} @click=${run('card_clicked', news)}></news-card>`
  );
}

@component<AppState>({
  tagName: 'app-root',
  shadowDom: 'open',
  state: {
    loadingNews: true,
    news: [],
    loadingCurrentNewsItem: false,
  },
  styles: [
    `:host {
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
    }`,
  ],
  render: template((ctx) => {
    const { state, run } = ctx;

    const showLoader = state.loadingNews || state.loadingCurrentNewsItem;

    return html`
      ${showLoader ? html`<app-loader></app-loader>` : null}

      <div class="cards">${createNewsCards(ctx)}</div>

      ${state.currentNewsItem
        ? html`<comments-drawer
            .comments=${state.currentNewsItem.comments}
            @close_drawer=${run('close_drawer')}
          ></comments-drawer>`
        : null}

      <div class="cards">${createNewsCards(ctx)}</div>
    `;
  }),
})
export class AppElement extends JoistElement {
  @get(State)
  private state!: State<AppState>;

  @get(HackerNewsService)
  private hackerNews!: HackerNewsService;

  connectedCallback(): void {
    super.connectedCallback();

    const news = this.hackerNews.getNews();
    const state = news.then((news) => ({ news, loadingNews: false }));

    this.state.patchValue(state);
  }

  @handle('card_clicked') onCardClicked(_: Event, news: HackerNewsItemFull): void {
    this.state.patchValue(this.loadDrawerElement().then(() => this.getNewsItem(news.id)));
  }

  @handle('close_drawer') onCloseDrawer(_: CustomEvent): void {
    this.state.patchValue({ currentNewsItem: undefined });
  }

  private loadDrawerElement() {
    return import('./comments-drawer/comments-drawer.element');
  }

  private getNewsItem(id: number) {
    return this.hackerNews.getNewsItem(id).then((currentNewsItem) => ({
      currentNewsItem,
      loadingCurrentNewsItem: false,
    }));
  }
}
