import { JoistElement, component, get, State, handle } from '@joist/component';
import { template, html } from '@joist/component/lit-html';

import './todo-item.element';
import { TodoService, Todo, TodoStatus } from './todo.service';

export interface TodoListState {
  todos: Todo[];
  totalActive: number;
}

@component<TodoListState>({
  tagName: 'todo-list',
  shadowDom: 'open',
  state: {
    todos: [],
    totalActive: 0,
  },
  styles: [
    `:host {
      display: block;
      background: #fff;
      position: relative;
    }

    .todo-list-footer {
      color: #777;
      padding: 10px 15px;
      height: 20px;
      text-align: center;
      border-top: 1px solid #e6e6e6;
      font-size: 14px;
      text-align: left;
    }

    .todo-list-footer:before {
      content: '';
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 50px;
      overflow: hidden;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6,
        0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6, 0 17px 2px -6px rgba(0, 0, 0, 0.2);
    }
    
    todo-item {
      border-bottom: solid 1px #f3f3f3;
    }
    
    todo-item:last-child {
      border-bottom: none;
    }`,
  ],
  render: template(({ state: { todos, totalActive }, run }) => {
    return html`
      <div class="todo-list">
        ${todos.map((todo, i) => {
          return html`
            <todo-item
              .todo=${todo}
              @remove_todo=${run('todo_item_remove', i)}
              @complete_todo=${run('todo_item_complete', i)}
            ></todo-item>
          `;
        })}
      </div>

      <div class="todo-list-footer">
        ${totalActive} item${todos.length > 1 ? 's' : ''} left
      </div>
    `;
  }),
})
export class TodoListElement extends JoistElement {
  @get(State)
  private state!: State<TodoListState>;

  @get(TodoService)
  private todo!: TodoService;

  async connectedCallback() {
    super.connectedCallback();

    await this.syncTodoState();

    this.todo.onChange(() => this.syncTodoState());
  }

  @handle('todo_item_remove')
  removeTodo(_: Event, i: number) {
    return this.todo.removeTodo(i);
  }

  @handle('todo_item_complete')
  completeTodo(_: Event, i: number) {
    const todo = this.todo.value[i];

    return this.todo.updateTodo(i, {
      status: todo.status === TodoStatus.Active ? TodoStatus.Completed : TodoStatus.Active,
    });
  }

  private syncTodoState() {
    const { value: todos } = this.todo;
    const totalActive = this.getActiveTodoCount();

    return this.state.patchValue({ todos, totalActive });
  }

  private getActiveTodoCount(): number {
    return this.todo.value
      .filter((todo) => todo.status === TodoStatus.Active)
      .reduce<number>((total) => total + 1, 0);
  }
}
