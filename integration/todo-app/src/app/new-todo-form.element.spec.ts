import { State } from '@joist/component';
import { defineTestBed } from '@joist/component/testing';
import { expect } from '@open-wc/testing';

import { NewTodoFormElement } from './new-todo-form.element';
import { TodoService, TodoStatus } from './todo.service';

describe('NewTodoFormElement', () => {
  it('should create new instance', () => {
    const el = defineTestBed().create(NewTodoFormElement);

    expect(el).instanceOf(NewTodoFormElement);
  });

  it('should add a new todo on form submit', () => {
    const el = defineTestBed().create(NewTodoFormElement);
    const state = el.injector.get(State);
    const todo = el.injector.get(TodoService);
    const form = el.shadowRoot!.querySelector('form') as HTMLFormElement;

    state.setValue('Hello World').then(() => {
      form.dispatchEvent(new Event('submit'));
    });

    return new Promise<void>((resolve) => {
      todo.onChange((val) => {
        expect(val.length).to.equal(1);
        expect(val[0].name).to.equal('Hello World');
        expect(val[0].status).to.equal(TodoStatus.Active);

        resolve();
      });
    });
  });
});
