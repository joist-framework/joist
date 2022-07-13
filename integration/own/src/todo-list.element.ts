import { Injected, injectable } from '@joist/di';
import { observable } from '@joist/observable';
import { styled, css } from '@joist/styled';

import {
  Todo,
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

      todo-card {
        border-bottom: solid 1px #f3f3f3;
      }

      todo-card:last-child {
        border-bottom: none;
      }
    `,
  ];

  constructor(private todo: Injected<TodoService>) {
    super();

    const root = this.attachShadow({ mode: 'open' });

    root.addEventListener('remove', this.onRemove.bind(this));
    root.addEventListener('complete', this.onComplete.bind(this));
  }

  connectedCallback() {
    const service = this.todo();
    const root = this.shadowRoot!;

    service.todos.forEach((todo) => {
      const el = root.getElementById(todo.id);

      if (!el) {
        root.appendChild(this.createCard(todo));
      }
    });

    service.addEventListener('todo_added', this.onTodoAdded.bind(this));
    service.addEventListener('todo_removed', this.onTodoRemoved.bind(this));
    service.addEventListener('todo_updated', this.onTodoChanged.bind(this));
  }

  private onRemove(e: Event) {
    const service = this.todo();

    if (e.target instanceof TodoCardElement) {
      service.removeTodo(e.target.id);
    }
  }

  private onComplete(e: Event) {
    const service = this.todo();

    if (e.target instanceof TodoCardElement) {
      service.updateTodo(e.target.id, {
        status: e.target.status === TodoStatus.Active ? TodoStatus.Complete : TodoStatus.Active,
      });
    }
  }

  private onTodoAdded(e: Event) {
    if (e instanceof TodoAddedEvent) {
      this.shadowRoot!.appendChild(this.createCard(e.todo));
    }
  }

  private onTodoRemoved(e: Event) {
    if (e instanceof TodoRemovedEvent) {
      const el = this.shadowRoot!.getElementById(e.todo);

      if (el instanceof TodoCardElement) {
        this.shadowRoot!.removeChild(el);
      }
    }
  }

  private onTodoChanged(e: Event) {
    if (e instanceof TodoUpdatedEvent) {
      const el = this.shadowRoot!.getElementById(e.todo.id);

      if (el instanceof TodoCardElement) {
        el.status = e.todo.status;
        el.innerHTML = e.todo.name;
      }
    }
  }

  private createCard(todo: Todo) {
    const el = document.createElement('todo-card') as TodoCardElement;
    el.id = todo.id;
    el.status = todo.status;
    el.innerHTML = todo.name;

    return el;
  }
}
