import { injectable } from '@joist/di';
import { FASTElement, customElement, css, html, observable } from '@microsoft/fast-element';

import { TodoService, Todo, TodoStatus } from './todo.service';

const template = html<TodoForm>/*html*/ `
  <form @submit=${(x, c) => x.onSubmit(c.event)}>
    <input
      :value=${(x) => x.value}
      name="todo"
      placeholder="What needs to be done?"
      autocomplete="off"
      autofocus
    />
  </form>
`;

@customElement({
  name: 'todo-form',
  template,
  styles: css`
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
})
@injectable
export class TodoForm extends FASTElement {
  static deps = [TodoService];

  @observable value: string = '';

  constructor(private todo: TodoService) {
    super();
  }

  onSubmit(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    const el = e.target as HTMLFormElement;
    const form = new FormData(el);
    const todo = form.get('todo') as string;

    this.value = todo;

    if (todo.length) {
      this.todo.addTodo(new Todo(todo, TodoStatus.Active));
      this.value = '';
    }
  }
}
