import { effect } from './effect.js';
import { observable, observe } from './observable.js';

describe('mapped', () => {
  it('should work', () => {
    @observable
    class Counter {
      @observe value = 1;

      inc() {
        this.value++;
      }
    }

    @observable
    class TodoList {
      @observe todos: string[] = [];

      addTodo(todo: string) {
        this.todos = [todo, ...this.todos];
      }
    }

    const counter1 = new Counter();
    const counter2 = new Counter();
    const todoList = new TodoList();

    counter1.inc();
    counter1.inc();
    counter2.inc();
    todoList.addTodo('first');

    effect(() => {
      // only called once
      console.log(counter1.value, counter2.value, todoList.todos);
    });
  });
});
