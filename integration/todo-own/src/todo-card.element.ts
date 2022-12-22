import { shadow, css, html } from '@joist/shadow';
import { attr, UpgradableElement, observable, observe, OnPropertyChanged } from '@joist/observable';

import { Todo, TodoStatus } from './services/todo.service.js';

@observable
export class TodoCardElement extends UpgradableElement implements OnPropertyChanged {
  static create(todo: Todo) {
    const card = new TodoCardElement();
    card.id = todo.id;
    card.status = todo.status;
    card.innerHTML = todo.name;

    return card;
  }

  static styles = css`
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

  static template = html`
    <div id="name">
      <slot></slot>
    </div>

    <button id="remove">remove</button>

    <button id="complete">complete</button>
  `;

  @observe @attr status: TodoStatus = TodoStatus.Active;

  #shadow = shadow(this);
  #completeBtn = this.#shadow.querySelector<HTMLButtonElement>('#complete')!;

  constructor() {
    super();

    this.#shadow.addEventListener('click', (e) => {
      if (e.target instanceof HTMLButtonElement) {
        this.dispatchEvent(new Event(e.target.id, { bubbles: true }));
      }
    });
  }

  onPropertyChanged() {
    const isActive = this.status === TodoStatus.Active;

    this.#completeBtn.innerHTML = isActive ? 'complete' : 'active';
  }
}
