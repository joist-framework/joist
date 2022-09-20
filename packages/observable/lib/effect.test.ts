import { expect } from '@open-wc/testing';
import { effect } from './effect.js';
import { Change, observable, observe } from './observable.js';

describe('effect', () => {
  it('should batch Changes', (done) => {
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

    const remove = effect(() => {
      expect(counter1.value).to.equal(3);
      expect(counter2.value).to.equal(2);
      expect(todoList.todos).to.deep.equal(['first']);

      done();
      remove();
    });
  });

  it('should keep track of the change events', (done) => {
    @observable
    class Counter {
      @observe value = 1;

      inc() {
        this.value++;
      }
    }

    const counter1 = new Counter();
    const counter2 = new Counter();

    counter1.inc();
    counter2.inc();

    const remove = effect((events) => {
      expect(events.map((e) => e.changes)).to.deep.equal([
        { value: new Change(2, 1, true) },
        { value: new Change(2, 1, true) },
      ]);

      done();
      remove();
    });
  });
});
