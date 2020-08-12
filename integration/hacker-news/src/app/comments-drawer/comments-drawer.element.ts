import { State, JoistElement, component, get, property } from '@joist/component';
import { template, html } from '@joist/component/lit-html';

import { HackerNewsItemComment } from '../hacker-news.service';

function createComment(comment: HackerNewsItemComment) {
  return html`
    <div>
      <div><b>${comment.user}</b> ${comment.time_ago}</div>

      <div .innerHTML=${comment.content}></div>

      <hr />
    </div>
  `;
}

@component<HackerNewsItemComment[]>({
  tagName: 'comments-drawer',
  shadowDom: 'open',
  state: [],
  render: template(({ state, dispatch }) => {
    return html`
      <style>
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
      </style>

      <div class="drawer-header">
        <span class="title">Comments</span>

        <button @click=${dispatch('close_drawer')}>close</button>
      </div>

      <div class="drawer-content">${state.map(createComment)}</div>
    `;
  }),
})
export class CommentsDrawerElement extends JoistElement {
  @get(State)
  private state!: State<HackerNewsItemComment[]>;

  @property()
  public comments?: HackerNewsItemComment[];

  onPropChanges() {
    this.state.setValue(this.comments || []);
  }
}
