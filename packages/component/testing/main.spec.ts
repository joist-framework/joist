import { Component, Get, JoistElement } from '@joist/component';

import { defineTestEnvironment } from './main';

describe('testing', () => {
  it('should create a new root scope for elements created from it', () => {
    class MyService {
      sayHello() {
        return 'Hello World';
      }
    }

    const environment = defineTestEnvironment([
      {
        provide: MyService,
        use: class implements MyService {
          sayHello() {
            return 'GOTCHA!';
          }
        },
      },
    ]);

    @Component({
      tagName: 'testing-1',
    })
    class MyElement extends JoistElement {
      @Get(MyService)
      public service!: MyService;
    }

    const el = environment.create(MyElement);

    expect(el.service.sayHello()).toBe('GOTCHA!');
  });
});
