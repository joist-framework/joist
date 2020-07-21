import { State, Handle, Component, JoistElement, Get } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

export interface TodoFormState {
  todo: string;
}

@Component<TodoFormState>({
  state: {
    todo: '',
  },
  useShadowDom: true,
  render: template(({ state, run }) => {
    return html`
      <form @submit=${run('FORM_SUBMIT')}>
        <input autocomplete="off" name="todo" placeholder="Add New Todo" .value=${state.todo} />

        <button>Add Todo</button>
      </form>
    `;
  }),
})
export class TodoFormElement extends JoistElement {
  @Get(State)
  private state!: State<TodoFormState>;

  @Handle('FORM_SUBMIT') onFormSubmit(e: Event) {
    e.preventDefault();

    const el = e.target as HTMLFormElement;
    const form = new FormData(el);
    const todo = form.get('todo') as string;

    this.state.setValue({ todo });

    if (todo.length) {
      this.dispatchEvent(
        new CustomEvent<string>('add_todo', { detail: todo })
      );

      this.state.setValue({ todo: '' });
    }
  }
}

customElements.define('todo-form', TodoFormElement);
