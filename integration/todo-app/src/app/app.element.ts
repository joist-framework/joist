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
import { template } from '@joist/component/lit-html';
import { html } from 'lit-html';

import { TodoService, Todo } from './todo.service';

export interface AppState {
  todos: Todo[];
}

function createTodoList({ state, run }: RenderCtx<AppState>) {
  return state.todos.map((todo, index) => {
    return html`
      <todo-card
        .todo=${todo}
        @remove_todo=${run('REMOVE_TODO', index)}
        @complete_todo=${run('COMPLETE_TODO', index)}
        @undo_complete=${run('UNDO_COMPLETE', index)}
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
      <todo-form @add_todo=${run('ADD_TODO')}></todo-form>

      ${!state.todos.length && html`<div class="placeholder">Looks Like Everything is Done!</div>`}

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

  @handle('ADD_TODO') onAddTodo(e: CustomEvent<string>): void {
    this.todo.addTodo(new Todo(e.detail, false));
  }

  @handle('REMOVE_TODO') onRemoveTodo(_: Event, payload: number): void {
    this.todo.removeTodo(payload);
  }

  @handle('COMPLETE_TODO') onCompleteTodo(_: Event, payload: number): void {
    this.todo.markTodoAsComplete(payload);
  }

  @handle('UNDO_COMPLETE') onUndoComplete(_: Event, payload: number): void {
    this.todo.markTodoAsComplete(payload, false);
  }
}
