import { expect } from '@open-wc/testing';
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
      expect(counter1.value).to.equal(3);
      expect(counter2.value).to.equal(2);
      expect(counter2.value).to.deep.equal(['first']);
    });
  });
});
