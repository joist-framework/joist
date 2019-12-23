import { Component, StateRef, State, Prop, OnPropChanges, Handle, ElRef } from '@lit-kit/component';
import { html } from 'lit-html';

import { HackerNewsItemComment } from '../hacker-news.service';

export interface CommentsDrawerState {
  comments: HackerNewsItemComment[];
}

@Component<CommentsDrawerState>({
  tag: 'comments-drawer',
  initialState: { comments: [] },
  useShadowDom: true,
  styles: [
    `
      :host {
        display: block;
      }

      .drawer-header {
        align-items: center;
        background: var(--color-primary);
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.23);
        height: var(--header-height);
        padding: 0 1rem;
        font-size: 1.5rem;
        color: #fff;
        z-index: 1;
        display: flex;
        position: relative;
      }

      .drawer-header .title {
        flex-grow: 1;
      }

      .drawer-header button {
        color: #fff;
        font-size: 1rem;
        padding: 0;
        margin: 0;
        background: 0;
        border: none;
      }

      .drawer-content {
        background: #fff;
        padding: 1rem;
        overflow-y: auto;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: var(--header-height);
        word-wrap: break-word;
      }
    `
  ],
  template(state, run) {
    return html`
      <div class="drawer-header">
        <span class="title">Comments</span>

        <button @click=${run('CLOSE_DRAWER')}>close</button>
      </div>

      <div class="drawer-content">
        ${state.comments.map(
          comment =>
            html`
              <div>
                <div><b>${comment.user}</b> ${comment.time_ago}</div>

                <div .innerHTML=${comment.content}></div>

                <hr />
              </div>
            `
        )}
      </div>
    `;
  }
})
export class CommentsDrawerComponent implements OnPropChanges {
  @Prop() comments: HackerNewsItemComment[] = [];

  constructor(
    @StateRef private state: State<CommentsDrawerState>,
    @ElRef private elRef: HTMLElement
  ) {}

  onPropChanges() {
    this.state.setValue({ comments: this.comments });
  }

  @Handle('CLOSE_DRAWER') onCloseDrawer() {
    this.elRef.dispatchEvent(new CustomEvent('close_drawer'));
  }
}
