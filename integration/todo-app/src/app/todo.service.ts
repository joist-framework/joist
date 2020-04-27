import { Service, Inject } from '@joist/di';
import { State } from '@joist/component';

export class Todo {
  constructor(public readonly name: string, public readonly isComplete: boolean) {}
}

export function TodoRef(c: any, p: string, i: number) {
  Inject(TodoService)(c, p, i);
}

@Service()
export class TodoService {
  public readonly todos = new State<Todo[]>([]);

  addTodo(todo: Todo): void {
    this.todos.setValue([...this.todos.value, todo]);
  }

  removeTodo(index: number) {
    this.todos.setValue(this.todos.value.filter((_, i) => i !== index));
  }

  markTodoAsComplete(index: number, isComplete: boolean = true) {
    this.todos.setValue(
      this.todos.value.map((todo, i) => {
        if (i === index) {
          return new Todo(todo.name, isComplete);
        }

        return todo;
      })
    );
  }
}
