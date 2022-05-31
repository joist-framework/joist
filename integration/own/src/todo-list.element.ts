import { Injected, injectable } from '@joist/di';
import { observable, observe, OnPropertyChanged, ForwardProps } from '@joist/observable';
import { styled, css } from '@joist/styled';
import { render, html } from 'lit-html';

import { TodoService, Todo, TodoStatus } from './services/todo.service';

@injectable
@observable
@styled
export class TodoList extends ForwardProps(HTMLElement) implements OnPropertyChanged {
  static inject = [TodoService];

  static styles = [
    css`
      :host {
        display: block;
        background: #fff;
        position: relative;
      }

      .todo-list-footer {
        color: #777;
        padding: 10px 15px;
        height: 20px;
        text-align: center;
        border-top: 1px solid #e6e6e6;
        font-size: 14px;
        text-align: left;
      }

      .todo-list-footer:before {
        content: '';
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 50px;
        overflow: hidden;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6,
          0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6,
          0 17px 2px -6px rgba(0, 0, 0, 0.2);
      }

      todo-card {
        border-bottom: solid 1px #f3f3f3;
      }

      todo-card:last-child {
        border-bottom: none;
      }
    `,
  ];

  @observe todos: Todo[] = [];
  @observe totalActive = 0;

  constructor(private todo: Injected<TodoService>) {
    super();

    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const service = this.todo();

    this.todos = service.todos;
    this.totalActive = this.getActiveTodoCount();

    service.addEventListener('todochange', () => {
      this.todos = service.todos;
      this.totalActive = this.getActiveTodoCount();
    });

    this.render();
  }

  onPropertyChanged() {
    this.render();
  }

  private template() {
    const service = this.todo();

    return html`
      <div class="todo-list">
        ${this.todos.map((todo, i) => {
          return html`
            <todo-card
              .status=${todo.status}
              @remove=${() => service.removeTodo(i)}
              @complete=${() => this.completeTodo(i)}
            >
              ${todo.name}
            </todo-card>
          `;
        })}
      </div>

      <div class="todo-list-footer">
        ${this.totalActive} item${this.todos.length > 1 ? 's' : ''} left
      </div>
    `;
  }

  private render() {
    render(this.template(), this.shadowRoot!);
  }

  private getActiveTodoCount(): number {
    return this.todo()
      .todos.filter((todo) => todo.status === TodoStatus.Active)
      .reduce<number>((total) => total + 1, 0);
  }

  private completeTodo(i: number) {
    const service = this.todo();

    const todo = service.todos[i];

    return service.updateTodo(i, {
      status: todo.status === TodoStatus.Active ? TodoStatus.Complete : TodoStatus.Active,
    });
  }
}

customElements.define('todo-list', TodoList);
