import { expect } from '@open-wc/testing';
import { effect } from './effect.js';
import { Change, observable, observe } from './observable.js';

describe('effect', () => {
  it('should batch Changes', (done) => {
    @observable
    class Counter {
      @observe value = 1;
    }

    @observable
    class TodoList {
      @observe todos: string[] = [];
    }

    const counter1 = new Counter();
    const counter2 = new Counter();
    const todoList = new TodoList();

    effect(
      () => {
        expect(counter1.value).to.equal(3);
        expect(counter2.value).to.equal(2);
        expect(todoList.todos).to.deep.equal(['first']);

        done();
      },
      { once: true }
    );

    counter1.value++;
    counter1.value++;
    counter2.value++;
    todoList.todos = ['first'];
  });

  it('should keep track of the change events', (done) => {
    @observable
    class Counter {
      @observe value = 1;
    }

    const counter1 = new Counter();
    const counter2 = new Counter();

    effect(
      (events) => {
        expect(events.map((e) => e.changes)).to.deep.equal([
          { value: new Change(2, 1, true) },
          { value: new Change(2, 1, true) },
        ]);

        done();
      },
      { once: true }
    );

    counter1.value++;
    counter2.value++;
  });

  it('should let you listen from a given root', (done) => {
    @observable
    class CounterElement extends HTMLElement {
      @observe value = 1;
    }

    window.customElements.define('my-el-1', CounterElement);

    const counter = new CounterElement();

    effect(
      (events) => {
        expect(events.map((e) => e.changes)).to.deep.equal([{ value: new Change(2, 1, true) }]);

        done();
      },
      { root: counter, once: true }
    );

    counter.value++;
  });
});
