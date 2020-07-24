import { Component, Get, JoistElement } from '@joist/component';

import { defineTestEnvironment } from './main';

describe('testing', () => {
  it('should create a new root scope for elements created from it', () => {
    class MyService {
      sayHello() {
        return 'Hello World';
      }
    }

    class MyMockService implements MyService {
      sayHello() {
        return 'GOTCHA!';
      }
    }

    const environment = defineTestEnvironment([{ provide: MyService, use: MyMockService }]);

    @Component({
      tagName: 'testing-1',
    })
    class MyElement extends JoistElement {
      @Get(MyService)
      public service!: MyService;
    }

    const el = new MyElement();
    const testingEl = environment.create(MyElement);

    expect(el.service.sayHello()).toBe('Hello World');
    expect(testingEl.service.sayHello()).toBe('GOTCHA!');
  });
});
