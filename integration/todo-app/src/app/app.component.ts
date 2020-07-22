import './todo-form/todo-form.element';
import './todo-card/todo-card.element';

import {
  State,
  Handle,
  OnConnected,
  Component,
  RenderCtx,
  Get,
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

@Component<AppState>({
  state: {
    todos: [],
  },
  render: template((ctx) => {
    const { state, run } = ctx;

    return html`
      <todo-form @add_todo=${run('ADD_TODO')}></todo-form>

      <todo-form @add_todo=${run('ADD_TODO')}></todo-form>

      <todo-form @add_todo=${run('ADD_TODO')}></todo-form>

      ${!state.todos.length
        ? html` <div class="placeholder">Looks Like Everything is Done!</div> `
        : ''}

      <section>${createTodoList(ctx)}</section>
    `;
  }),
})
export class AppElement extends JoistElement implements OnConnected {
  @Get(State)
  private state!: State<AppState>;

  @Get(TodoService)
  private todo!: TodoService;

  connectedCallback(): void {
    this.state.setValue({ todos: this.todo.todos.value });

    this.todo.todos.onChange((todos) => {
      this.state.setValue({ todos });
    });
  }

  @Handle('ADD_TODO') onAddTodo(e: CustomEvent<string>): void {
    this.todo.addTodo(new Todo(e.detail, false));
  }

  @Handle('REMOVE_TODO') onRemoveTodo(_: Event, payload: number): void {
    this.todo.removeTodo(payload);
  }

  @Handle('COMPLETE_TODO') onCompleteTodo(_: Event, payload: number): void {
    this.todo.markTodoAsComplete(payload);
  }

  @Handle('UNDO_COMPLETE') onUndoComplete(_: Event, payload: number): void {
    this.todo.markTodoAsComplete(payload, false);
  }
}

customElements.define('app-root', AppElement);
