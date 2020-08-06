import { State, component, JoistElement, get, OnConnected } from '@joist/component';
import { template, html } from '@joist/component/lit-html';

@component({
  tagName: 'todo-form',
  state: '',
  render: template(({ state }) => {
    return html`
      <form>
        <input autocomplete="off" name="todo" placeholder="Add New Todo" .value=${state} />

        <button>Add Todo</button>
      </form>
    `;
  }),
})
export class TodoFormElement extends JoistElement implements OnConnected {
  @get(State)
  private state!: State<string>;

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

    this.state.setValue(todo);

    if (todo.length) {
      this.dispatchEvent(
        new CustomEvent<string>('add_todo', { detail: todo })
      );

      this.state.setValue('');
    }
  }
}
