import { css, html, template, styles, listen, attr } from '@joist/element';

import { Todo } from './services/todo.service.js';

export class TodoCardElement extends HTMLElement {
  static observedAttributes = ['status'];

  @styles styles = css`
    :host {
      align-items: center;
      display: flex;
      padding: 1rem;
    }

    #name {
      flex-grow: 1;
    }

    :host([status='complete']) #name {
      text-decoration: line-through;
      opacity: 0.5;
    }

    button {
      border: none;
      color: cornflowerblue;
      cursor: pointer;
      font-size: 1rem;
      background: none;
      margin-left: 0.5rem;
    }

    button#remove {
      color: darkred;
    }
  `;

  @template template = html`
    <div id="name">
      <slot></slot>
    </div>

    <button id="remove">remove</button>

    <button id="complete">complete</button>
  `;

  @attr accessor status = '';

  #completeBtn = this.shadowRoot!.querySelector<HTMLButtonElement>('#complete')!;

  @listen('click') onClick(e: Event) {
    if (e.target instanceof HTMLButtonElement) {
      this.dispatchEvent(new Event(e.target.id, { bubbles: true }));
    }
  }

  attributeChangedCallback() {
    const isActive = this.status === 'active';

    this.#completeBtn.innerHTML = isActive ? 'complete' : 'active';
  }
}

export function createTodoCard(todo: Todo) {
  const card = new TodoCardElement();
  card.id = todo.id;
  card.innerHTML = todo.name;

  card.setAttribute('status', todo.status);

  return card;
}
