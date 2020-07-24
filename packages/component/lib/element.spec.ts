import { Service } from '@joist/di';

import { JoistElement, Get } from './element';
import { Component } from './component';
import { getEnvironmentRef, clearEnvironment } from './environment';
import { State } from './state';
import { Handle } from './handle';

describe('JoistElement', () => {
  describe('state', () => {
    @Component({
      tagName: 'state-1',
      state: 0,
      render({ state, host }) {
        host.innerHTML = state.toString();
      },
    })
    class MyElement extends JoistElement {
      @Get(State) public state!: State<number>;
    }

    it('should update the view when state is updated', async () => {
      const el: MyElement = Reflect.construct(MyElement, []);

      el.connectedCallback();

      expect(el.innerHTML.trim()).toBe('0');

      await el.state.setValue(el.state.value + 1);

      expect(el.innerHTML.trim()).toBe('1');
    });
  });

  describe('dependency injection', () => {
    it('should map a service to a property', () => {
      @Service()
      class MyService {
        helloWorld() {
          return 'Hello World';
        }
      }

      @Component({
        tagName: 'di-1',
      })
      class MyElement extends JoistElement {
        @Get(MyService) public service!: MyService;
      }

      const el: MyElement = Reflect.construct(MyElement, []);

      expect(el.injector.get(MyService)).toBe(el.service);
      expect(el.service.helloWorld()).toBe('Hello World');
    });

    it('should use scoped providers', () => {
      @Service()
      class MyService {
        helloWorld() {
          return 'Hello World';
        }
      }

      @Component({
        tagName: 'di-2',
        providers: [{ provide: MyService, use: class extends MyService {} }],
      })
      class MyElement extends JoistElement {
        @Get(MyService)
        public service!: MyService;
      }

      const el: MyElement = Reflect.construct(MyElement, []);

      expect(getEnvironmentRef().get(MyService)).not.toBe(el.service);

      clearEnvironment();
    });
  });

  describe('handlers', () => {
    it('should call a function if the trigger is mapped to a class method', () => {
      @Component({
        tagName: 'handlers-1',
        render({ run, host }) {
          const button = document.createElement('button');

          button.onclick = run('TEST_RUN', 'Hello World');

          host.append(button);
        },
      })
      class MyElement extends JoistElement {
        @Handle('TEST_RUN') onTestRun(_e: Event, _payload: string) {}
      }

      const el: MyElement = Reflect.construct(MyElement, []);

      spyOn(el, 'onTestRun');

      el.connectedCallback();

      const button = el.querySelector('button') as HTMLButtonElement;

      button.click();

      expect(el.onTestRun).toHaveBeenCalledTimes(1);
      expect(el.onTestRun).toHaveBeenCalledWith(new MouseEvent('click'), 'Hello World');
    });

    it('should handle multiple functions', () => {
      @Component({
        tagName: 'handlers-2',
        render({ run, host }) {
          const button = document.createElement('button');

          button.onclick = run('TEST_RUN', 'Hello World');

          host.appendChild(button);
        },
      })
      class MyElement extends JoistElement {
        @Handle('TEST_RUN') onTestRun() {}
        @Handle('TEST_RUN') onTestRun2() {}
      }

      const el: MyElement = Reflect.construct(MyElement, []);

      spyOn(el, 'onTestRun');
      spyOn(el, 'onTestRun2');

      el.connectedCallback();

      const button = el.querySelector('button') as HTMLButtonElement;

      button.click();

      expect(el.onTestRun).toHaveBeenCalledTimes(1);
      expect(el.onTestRun2).toHaveBeenCalledTimes(1);
    });

    it('should let one function handle multiple actions', () => {
      @Component({
        tagName: 'handlers-3',
        render({ run, host }) {
          const button = document.createElement('button');

          button.addEventListener('click', run('FOO', 'foo'));
          button.addEventListener('click', run('BAR', 'bar'));

          host.append(button);
        },
      })
      class MyElement extends JoistElement {
        @Handle('FOO')
        @Handle('BAR')
        onTestRun(_e: Event, _payload: string) {}
      }

      const el: MyElement = Reflect.construct(MyElement, []);

      spyOn(el, 'onTestRun');

      el.connectedCallback();

      const button = el.querySelector('button') as HTMLButtonElement;

      button.click();

      expect(el.onTestRun).toHaveBeenCalledTimes(2);
      expect(el.onTestRun).toHaveBeenCalledWith(new MouseEvent('click'), 'foo');
      expect(el.onTestRun).toHaveBeenCalledWith(new MouseEvent('click'), 'bar');
    });
  });

  describe('ShadowDom', () => {
    it('should create an open shadow root', async () => {
      @Component({
        tagName: 'shadow-1',
        shadowDom: 'open',
        state: 0,
        render({ state, host }) {
          host.innerHTML = state.toString();
        },
      })
      class MyElement extends JoistElement {}

      const el: MyElement = Reflect.construct(MyElement, []);

      expect(el.shadowRoot!.mode).toBe('open');
    });
  });
});
