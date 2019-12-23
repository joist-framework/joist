import { Component, StateRef, State, ElRef, Handle } from '@lit-kit/component';
import { html } from 'lit-html';

export interface TodoFormState {
  todo: string;
}

@Component<TodoFormState>({
  tag: 'todo-form',
  initialState: { todo: '' },
  useShadowDom: true,
  styles: [
    `
      :host {
        display: inline-block;
      }

      input {
        box-sizing: border-box;
        display: inline-block;
        width: 100%;
        height: 100%;
        border: solid 1px lightgray;
        margin: 0;
        padding: 1rem;
        font-size: 1rem;
      }

      button {
        display: none;
      }
    `
  ],
  template(state, run) {
    return html`
      <form @submit=${run('FORM_SUBMIT')}>
        <input autocomplete="off" name="todo" placeholder="Add New Todo" .value=${state.todo} />

        <button>Add Todo</button>
      </form>
    `;
  }
})
export class TodoFormComponent {
  constructor(@StateRef private state: State<TodoFormState>, @ElRef private elRef: HTMLElement) {}

  @Handle('FORM_SUBMIT') onFormSubmit(e: Event) {
    e.preventDefault();

    const el = e.target as HTMLFormElement;
    const form = new FormData(el);
    const todo = form.get('todo') as string;

    this.state.setValue({ todo });

    if (todo.length) {
      this.dispatchAddTodo(todo);

      this.state.setValue({ todo: '' });
    }
  }

  private dispatchAddTodo(detail: string) {
    this.elRef.dispatchEvent(new CustomEvent('add_todo', { detail }));
  }
}
