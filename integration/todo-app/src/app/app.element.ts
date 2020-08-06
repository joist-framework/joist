import './todo-form/todo-form.element';
import './todo-card/todo-card.element';

import {
  State,
  handle,
  OnConnected,
  component,
  RenderCtx,
  get,
  JoistElement,
} from '@joist/component';
import { template, html } from '@joist/component/lit-html';

import { TodoService, Todo } from './todo.service';

export interface AppState {
  todos: Todo[];
}

function createTodoList({ state, run }: RenderCtx<AppState>) {
  return state.todos.map((todo, index) => {
    return html`
      <todo-card
        .todo=${todo}
        @remove_todo=${run('remove_todo', index)}
        @complete_todo=${run('complete_todo', index)}
        @undo_complete=${run('undo_complete', index)}
      ></todo-card>
    `;
  });
}

@component<AppState>({
  tagName: 'app-root',
  state: {
    todos: [],
  },
  render: template((ctx) => {
    const { state, run } = ctx;

    return html`
      <todo-form @add_todo=${run('add_todo')}></todo-form>

      ${!state.todos.length
        ? html`<div class="placeholder">Looks Like Everything is Done!</div>`
        : null}

      <section>${createTodoList(ctx)}</section>
    `;
  }),
})
export class AppElement extends JoistElement implements OnConnected {
  @get(State)
  private state!: State<AppState>;

  @get(TodoService)
  private todo!: TodoService;

  connectedCallback(): void {
    super.connectedCallback();

    this.state.setValue({ todos: this.todo.todos.value });

    this.todo.todos.onChange((todos) => {
      this.state.setValue({ todos });
    });
  }

  @handle('add_todo') onAddTodo(e: CustomEvent<string>): void {
    this.todo.addTodo(new Todo(e.detail, false));
  }

  @handle('remove_todo') onRemoveTodo(_: Event, payload: number): void {
    this.todo.removeTodo(payload);
  }

  @handle('complete_todo') onCompleteTodo(_: Event, payload: number): void {
    this.todo.markTodoAsComplete(payload);
  }

  @handle('undo_complete') onUndoComplete(_: Event, payload: number): void {
    this.todo.markTodoAsComplete(payload, false);
  }
}
