import { TodoService, AppStorage, Todo, TodoStatus } from './todo.service';
import { expect } from '@open-wc/testing';

describe('TodoService', () => {
  class InMemoryStorage implements AppStorage {
    private storage: any = {};

    loadJSON<T>(key: string): T | undefined {
      return this.storage[key];
    }

    saveJSON<T extends object>(key: string, val: T): boolean {
      this.storage[key] = val;
      return true;
    }
  }

  it('should add a todo', async () => {
    const todo = new TodoService(new InMemoryStorage());

    await todo.addTodo(new Todo('hello-world-1', TodoStatus.Active));
    await todo.addTodo(new Todo('hello-world-2', TodoStatus.Active));
    await todo.addTodo(new Todo('hello-world-3', TodoStatus.Active));

    expect(todo.value).deep.equal([
      new Todo('hello-world-1', TodoStatus.Active),
      new Todo('hello-world-2', TodoStatus.Active),
      new Todo('hello-world-3', TodoStatus.Active),
    ]);
  });

  it('should remove a todo', async () => {
    const todo = new TodoService(new InMemoryStorage());

    await todo.addTodo(new Todo('hello-world-1', TodoStatus.Active));
    await todo.addTodo(new Todo('hello-world-2', TodoStatus.Active));
    await todo.addTodo(new Todo('hello-world-3', TodoStatus.Active));

    await todo.removeTodo(0);

    expect(todo.value).deep.equal([
      new Todo('hello-world-2', TodoStatus.Active),
      new Todo('hello-world-3', TodoStatus.Active),
    ]);
  });
});
