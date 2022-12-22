import { Injected, injectable } from '@joist/di';
import { shadow, css, html } from '@joist/shadow';
import { UpgradableElement } from '@joist/observable';

import { TodoService, Todo, TodoStatus } from './services/todo.service.js';

@injectable
export class TodoFormElement extends UpgradableElement {
  static inject = [TodoService];

  static styles = css`
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
  `;

  static template = html`
    <form>
      <input
        id="input"
        name="todo"
        placeholder="What needs to be done?"
        autocomplete="off"
        autofocus
      />
    </form>
  `;

  #root = shadow(this);
  #input = this.#root.querySelector<HTMLInputElement>('#input')!;

  constructor(private getTodo: Injected<TodoService>) {
    super();

    this.#root.addEventListener('submit', this.#onSubmit.bind(this));
  }

  #onSubmit(e: Event) {
    const service = this.getTodo();

    e.preventDefault();

    if (this.#input.value) {
      service.addTodo(Todo.create(this.#input.value, TodoStatus.Active));

      this.#input.value = '';
    }
  }
}
