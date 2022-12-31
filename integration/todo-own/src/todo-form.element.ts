import { Injected, injectable } from '@joist/di';
import { shadow, css, html, ShadowTemplate } from '@joist/shadow';

import { TodoService, Todo } from './services/todo.service.js';

export const template: ShadowTemplate = {
  css: css`
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
  html: html`
    <form>
      <input
        id="input"
        name="todo"
        placeholder="What needs to be done?"
        autocomplete="off"
        autofocus
      />
    </form>
  `,
};

@injectable
export class TodoFormElement extends HTMLElement {
  static inject = [TodoService];

  #shadow: ShadowRoot;
  #input: HTMLInputElement;
  #todos: Injected<TodoService>;

  constructor(todos: Injected<TodoService>) {
    super();

    this.#todos = todos;
    this.#shadow = shadow(this, template);
    this.#input = this.#shadow.querySelector<HTMLInputElement>('#input')!;

    this.#shadow.addEventListener('submit', this.#onSubmit.bind(this));
  }

  #onSubmit(e: Event) {
    const service = this.#todos();

    e.preventDefault();

    if (this.#input.value) {
      service.addTodo(Todo.create(this.#input.value, 'active'));

      this.#input.value = '';
    }
  }
}
