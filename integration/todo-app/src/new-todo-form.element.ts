import { JoistElement, component, handle, State, get } from '@joist/component';
import { template, html } from '@joist/component/lit-html';

import { TodoService, Todo, TodoStatus } from './todo.service';

@component({
  tagName: 'new-todo-form',
  shadowDom: 'open',
  state: '',
  styles: [
    `:host {
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
    }`,
  ],
  render: template(({ run, state }) => {
    return html`
      <form @submit=${run('todo_form_submit')}>
        <input
          name="todo"
          .value=${state}
          placeholder="What needs to be done?"
          autocomplete="off"
          autofocus
        />
      </form>
    `;
  }),
})
export class NewTodoFormElement extends JoistElement {
  @get(State)
  private state!: State<string>;

  @get(TodoService)
  private todo!: TodoService;

  @handle('todo_form_submit')
  addTodo(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    const el = e.target as HTMLFormElement;
    const form = new FormData(el);
    const todo = form.get('todo') as string;

    this.state.setValue(todo);

    if (todo.length) {
      this.todo.addTodo(new Todo(todo, TodoStatus.Active));

      this.state.setValue('');
    }
  }
}
