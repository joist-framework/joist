import { Injected, injectable } from '@joist/di';
import { css, html, template, styles, listen } from '@joist/element';

import {
  TodoAddedEvent,
  TodoUpdatedEvent,
  TodoRemovedEvent,
  TodoService,
} from './services/todo.service.js';
import { createTodoCard, TodoCardElement } from './todo-card.element.js';

@injectable
export class TodoListElement extends HTMLElement {
  static inject = [TodoService];

  @styles styles = css`
    :host {
      display: block;
      background: #fff;
      position: relative;
    }

    ::slotted(todo-card) {
      border-bottom: solid 1px #f3f3f3;
    }

    ::slotted(todo-card:last-child) {
      border-bottom: none;
    }
  `;

  @template template = html`<slot></slot>`;

  #listeners: Function[] = [];
  #todo: Injected<TodoService>;

  constructor(todo: Injected<TodoService>) {
    super();

    this.#todo = todo;
  }

  async connectedCallback() {
    const service = this.#todo();
    const todos = await service.getTodos();

    todos.forEach((todo) => {
      if (!this.querySelector('#' + todo.id)) {
        this.appendChild(createTodoCard(todo));
      }
    });

    this.#listeners = [
      service.listen('todo_added', this.#onTodoAdded.bind(this)),
      service.listen('todo_removed', this.#onTodoRemoved.bind(this)),
      service.listen('todo_updated', this.#onTodoChanged.bind(this)),
    ];
  }

  disconnectedCallback() {
    this.#listeners.forEach((remove) => remove());
  }

  @listen('remove') onRemove(e: Event) {
    if (e.target instanceof TodoCardElement) {
      this.#todo().removeTodo(e.target.id);
    }
  }

  @listen('complete') onComplete(e: Event) {
    if (e.target instanceof TodoCardElement) {
      const status = e.target.getAttribute('status');

      this.#todo().updateTodo(e.target.id, {
        status: status === 'active' ? 'complete' : 'active',
      });
    }
  }

  #onTodoAdded(e: Event) {
    if (e instanceof TodoAddedEvent) {
      this.appendChild(createTodoCard(e.todo));
    }
  }

  #onTodoRemoved(e: Event) {
    if (e instanceof TodoRemovedEvent) {
      const el = this.querySelector('#' + e.todo);

      if (el instanceof TodoCardElement) {
        this.removeChild(el);
      }
    }
  }

  #onTodoChanged(e: Event) {
    if (e instanceof TodoUpdatedEvent) {
      const el = this.querySelector('#' + e.todo.id);

      if (el instanceof TodoCardElement) {
        el.innerHTML = e.todo.name;

        el.setAttribute('status', e.todo.status);
      }
    }
  }
}
