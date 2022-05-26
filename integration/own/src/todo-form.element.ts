import { Injected, injectable } from '@joist/di';
import { styled, css } from '@joist/styled';
import {
  attr,
  Changes,
  observable,
  observe,
  OnPropertyChanged,
  ObservableElement,
} from '@joist/observable';
import { query } from '@joist/query';

import { TodoService, Todo, TodoStatus } from './services/todo.service';

const template = document.createElement('template');
template.innerHTML = /*html*/ `
  <form>
    <input id="input" name="todo" placeholder="What needs to be done?" autocomplete="off" autofocus />
  </form>
`;

@injectable
@styled
@observable
export class TodoForm extends ObservableElement implements OnPropertyChanged {
  static inject = [TodoService];

  static styles = [
    css`
      :host {
        display: block;
        background: #fff;
      }

      input {
        box-sizing: border-box;
        display: block;
        padding: 1rem;
        border: none;
        background: rgba(0, 0, 0, 0.003);
        box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
        margin: 0;
        width: 100%;
        font-size: 24px;
        line-height: 1.4em;
        border: 0;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      :focus {
        outline: none;
      }

      ::-webkit-input-placeholder {
        font-style: italic;
        font-weight: 300;
        color: #e6e6e6;
      }

      ::-moz-placeholder {
        font-style: italic;
        font-weight: 300;
        color: #e6e6e6;
      }

      ::input-placeholder {
        font-style: italic;
        font-weight: 300;
        color: #e6e6e6;
      }
    `,
  ];

  @observe @attr value = '';

  @query('#input') input!: HTMLInputElement;

  constructor(private todo: Injected<TodoService>) {
    super();
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' });

    root.appendChild(template.content.cloneNode(true));

    this.input.addEventListener('input', () => {
      this.value = this.input.value;
    });

    root.addEventListener('submit', (e) => {
      this.onSubmit(e);
    });
  }

  onPropertyChanged(changes: Changes): void {
    console.log(changes);

    this.input.value = this.value;
  }

  private onSubmit(e: Event) {
    e.preventDefault();

    const todo = this.input.value;

    if (todo.length) {
      this.todo().addTodo(new Todo(todo, TodoStatus.Active));

      this.input.value = '';
    }
  }
}

customElements.define('todo-form', TodoForm);
