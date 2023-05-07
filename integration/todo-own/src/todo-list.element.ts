import { Injected, injectable } from '@joist/di';
import { css, html, template, styles } from '@joist/shadow';

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

  @template template = html`<slot></slot>`,

  #listeners: Function[] = [];

  constructor(private getTodoService: Injected<TodoService>) {
    super();

    this.addEventListener('remove', this.#onRemove.bind(this));
    this.addEventListener('complete', this.#onComplete.bind(this));
  }

  async connectedCallback() {
    const service = this.getTodoService();
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

  #onRemove(e: Event) {
    if (e.target instanceof TodoCardElement) {
      this.getTodoService().removeTodo(e.target.id);
    }
  }

  #onComplete(e: Event) {
    if (e.target instanceof TodoCardElement) {
      const status = e.target.getAttribute('status');

      this.getTodoService().updateTodo(e.target.id, {
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
