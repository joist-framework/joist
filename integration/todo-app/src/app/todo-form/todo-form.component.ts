import { Component, StateRef, State, ElRef, Handle, defineElement } from '@joist/component';
import { html } from 'lit-html';

export interface TodoFormState {
  todo: string;
}

@Component<TodoFormState>({
  initialState: { todo: '' },
  useShadowDom: true,
  template({ state, run }) {
    return html`
      <form @submit=${run('FORM_SUBMIT')}>
        <input autocomplete="off" name="todo" placeholder="Add New Todo" .value=${state.todo} />

        <button>Add Todo</button>
      </form>
    `;
  },
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

customElements.define('todo-form', defineElement(TodoFormComponent));
