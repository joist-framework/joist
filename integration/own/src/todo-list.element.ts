import { Injected, injectable } from '@joist/di';
import { observable } from '@joist/observable';
import { styled, css } from '@joist/styled';

import {
  TodoAddedEvent,
  TodoUpdatedEvent,
  TodoRemovedEvent,
  TodoService,
  TodoStatus,
} from './services/todo.service';
import { TodoCardElement } from './todo-card.element';

@injectable
@observable
@styled
export class TodoListElement extends HTMLElement {
  static inject = [TodoService];

  static styles = [
    css`
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
    `,
  ];

  #listeners: Function[] = [];

  constructor(private getTodoService: Injected<TodoService>) {
    super();

    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = '<slot></slot>';

    this.addEventListener('remove', this.#onRemove.bind(this));
    this.addEventListener('complete', this.#onComplete.bind(this));
  }

  async connectedCallback() {
    const service = this.getTodoService();
    const todos = await service.getTodos();

    todos.forEach((todo) => {
      if (!this.querySelector('#' + todo.id)) {
        this.appendChild(TodoCardElement.create(todo));
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
      this.getTodoService().updateTodo(e.target.id, {
        status: e.target.status === TodoStatus.Active ? TodoStatus.Complete : TodoStatus.Active,
      });
    }
  }

  #onTodoAdded(e: Event) {
    if (e instanceof TodoAddedEvent) {
      this.appendChild(TodoCardElement.create(e.todo));
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
        el.status = e.todo.status;
        el.innerHTML = e.todo.name;
      }
    }
  }
}
