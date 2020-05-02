import './todo-form/todo-form.component';
import './todo-card/todo-card.component';

import { Component, StateRef, State, Handle, OnConnected, defineElement } from '@joist/component';
import { html } from 'lit-html';

import { TodoRef, TodoService, Todo } from './todo.service';

export interface AppState {
  todos: Todo[];
}

@Component<AppState>({
  state: { todos: [] },
  useShadowDom: false,
  render({ state, run }) {
    return html`
      <style>
        app-root {
          display: block;
        }

        app-root todo-form {
          width: 100%;
          margin-bottom: 0.5rem;
        }

        app-root todo-card {
          margin-bottom: 0.5rem;
        }

        app-root .placeholder {
          font-size: 1.5rem;
          text-align: center;
          padding: 1rem 0;
          color: gray;
        }
      </style>

      <todo-form @add_todo=${run('ADD_TODO')}></todo-form>

      ${!state.todos.length
        ? html` <div class="placeholder">Looks Like Everything is Done!</div> `
        : ''}

      <section>
        ${state.todos.map((todo, index) => {
          return html`
            <todo-card
              .todo=${todo}
              @remove_todo=${run('REMOVE_TODO', index)}
              @complete_todo=${run('COMPLETE_TODO', index)}
              @undo_complete=${run('UNDO_COMPLETE', index)}
            ></todo-card>
          `;
        })}
      </section>
    `;
  },
})
export class AppComponent implements OnConnected {
  constructor(
    @StateRef private componentState: State<AppState>,
    @TodoRef private todo: TodoService
  ) {}

  connectedCallback(): void {
    this.componentState.setValue({ todos: this.todo.todos.value });

    this.todo.todos.onChange((todos) => {
      this.componentState.setValue({ todos });
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

customElements.define('app-root', defineElement(AppComponent));
