import { State, Component, JoistElement, Get, OnConnected } from '@joist/component';
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

export interface TodoFormState {
  todo: string;
}

@Component<TodoFormState>({
  state: {
    todo: '',
  },
  render: template(({ state }) => {
    return html`
      <form>
        <input autocomplete="off" name="todo" placeholder="Add New Todo" .value=${state.todo} />

        <button>Add Todo</button>
      </form>
    `;
  }),
})
export class TodoFormElement extends JoistElement implements OnConnected {
  @Get(State)
  private state!: State<TodoFormState>;

  constructor() {
    super();

    this.addEventListener('submit', this.onFormSubmit.bind(this));
  }

  private onFormSubmit(e: Event) {
    e.preventDefault();
    e.stopPropagation();

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
