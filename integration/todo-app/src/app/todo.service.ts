import { Service, Inject } from '@lit-kit/di';
import { State } from '@lit-kit/component';

export const TodoRef = () => (c: any, p: any, i: any) => Inject(TodoService)(c, p, i);

export class Todo {
  constructor(public readonly name: string, public readonly isComplete: boolean) {}
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
