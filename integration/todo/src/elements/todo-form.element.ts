import { inject, injectable } from '@joist/di';
import { css, html, shadow, listen, tagName } from '@joist/element';

import { TodoService, Todo } from '../services/todo.service.js';

@injectable
export class TodoFormElement extends HTMLElement {
  @tagName static tagName = 'todo-form';

  @shadow styles = css`
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

  @shadow dom = html`
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

  #input = this.dom.query<HTMLInputElement>('#input')!;
  #todos = inject(TodoService);

  @listen('submit') onSubmit(e: Event) {
    const service = this.#todos();

    e.preventDefault();

    if (this.#input.value) {
      service.addTodo(Todo.create(this.#input.value, 'active'));

      this.#input.value = '';
    }
  }
}
