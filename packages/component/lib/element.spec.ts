import { service } from '@joist/di';
import { expect } from '@open-wc/testing';
import { spy } from 'sinon';

import { JoistElement, get, withInjector } from './element';
import { component } from './component';
import { getEnvironmentRef, clearEnvironment } from './environment';
import { State } from './state';
import { handle } from './handle';

describe('JoistElement', () => {
  describe('withInjector', () => {
    it('should add an injector to any CustomElementConstructor', () => {
      class MyService {}

      class MyElement extends withInjector(HTMLElement) {
        @get(MyService)
        public myService!: MyService;
      }

      customElements.define('withinjector-test-1', MyElement);

      const el = new MyElement();

      expect(el.myService.constructor).to.equal(MyService);
    });
  });

  describe('state', () => {
    @component({
      tagName: 'state-test-1',
      state: 0,
      render({ state, host }) {
        host.innerHTML = state.toString();
      },
    })
    class MyElement extends JoistElement {
      @get(State)
      public state!: State<number>;
    }

    it('should update the view when state is updated', async () => {
      const el = new MyElement();

      el.connectedCallback();

      expect(el.innerHTML.trim()).to.equal('0');

      await el.state.setValue(el.state.value + 1);

      expect(el.innerHTML.trim()).to.equal('1');
    });
  });

  describe('host', () => {
    it('should set host to the custom element instance', (done) => {
      @component({
        tagName: 'host-test-1',
        state: 0,
        render({ host }) {
          expect(host).to.be.instanceOf(MyElement);

          done();
        },
      })
      class MyElement extends JoistElement {}

      new MyElement().connectedCallback();
    });
  });

  describe('dependency injection', () => {
    it('should map a service to a property', () => {
      @service()
      class MyService {
        helloWorld() {
          return 'Hello World';
        }
      }

      @component({
        tagName: 'di-1',
      })
      class MyElement extends JoistElement {
        @get(MyService) service!: MyService;
      }

      const el = new MyElement();

      expect(el.injector.get(MyService)).to.equal(el.service);
      expect(el.service.helloWorld()).to.equal('Hello World');
    });

    it('should use scoped providers', () => {
      @service()
      class MyService {
        helloWorld() {
          return 'Hello World';
        }
      }

      @component({
        tagName: 'di-2',
        providers: [{ provide: MyService, use: class extends MyService {} }],
      })
      class MyElement extends JoistElement {
        @get(MyService) service!: MyService;
      }

      const el = new MyElement();

      expect(el.service).to.be.instanceOf(MyService);

      expect(getEnvironmentRef().get(MyService)).not.to.equal(el.service);

      clearEnvironment();
    });
  });

  describe('handlers', () => {
    it('should call a function if the trigger is mapped to a class method', () => {
      @component({
        tagName: 'handlers-1',
        render({ run, host }) {
          const button = document.createElement('button');

          button.onclick = run('TEST_RUN', 'Hello World');

          host.append(button);
        },
      })
      class MyElement extends JoistElement {
        @handle('TEST_RUN') onTestRun(..._: any[]) {}
      }

      const el = new MyElement();

      spy(el, 'onTestRun');

      el.connectedCallback();

      const button = el.querySelector('button') as HTMLButtonElement;

      button.click();

      expect(el.onTestRun).calledWith(new MouseEvent('click'), 'Hello World', 'TEST_RUN');
    });

    it('should handle multiple functions', () => {
      @component({
        tagName: 'handlers-2',
        render({ run, host }) {
          const button = document.createElement('button');

          button.onclick = run('TEST_RUN', 'Hello World');

          host.appendChild(button);
        },
      })
      class MyElement extends JoistElement {
        @handle('TEST_RUN') onTestRun() {}
        @handle('TEST_RUN') onTestRun2() {}
      }

      const el = new MyElement();

      spy(el, 'onTestRun');
      spy(el, 'onTestRun2');

      el.connectedCallback();

      const button = el.querySelector('button') as HTMLButtonElement;

      button.click();

      expect(el.onTestRun).calledOnce;
      expect(el.onTestRun2).calledOnce;
    });

    it('should let one function handle multiple actions', () => {
      @component({
        tagName: 'handlers-3',
        render({ run, host }) {
          const button = document.createElement('button');

          button.addEventListener('click', run('FOO', 'foo'));
          button.addEventListener('click', run('BAR', 'bar'));

          host.append(button);
        },
      })
      class MyElement extends JoistElement {
        @handle('FOO')
        @handle('BAR')
        onTestRun(..._: any[]) {}
      }

      const el = new MyElement();

      spy(el, 'onTestRun');

      el.connectedCallback();

      const button = el.querySelector('button') as HTMLButtonElement;

      button.click();

      expect(el.onTestRun).calledTwice;
      expect(el.onTestRun).calledWith(new MouseEvent('click'), 'foo', 'FOO');
      expect(el.onTestRun).calledWith(new MouseEvent('click'), 'bar', 'BAR');
    });

    it('should allow a user to match on a Regex', () => {
      @component({
        tagName: 'handlers-4',
        render({ run, host }) {
          const button = document.createElement('button');

          button.addEventListener('click', run('foo-bar'));

          host.append(button);
        },
      })
      class MyElement extends JoistElement {
        @handle(/foo-*/)
        onTestRun(..._: any[]) {}

        @handle('foo')
        badFn(..._: any[]) {}
      }

      const el = new MyElement();

      spy(el, 'onTestRun');
      spy(el, 'badFn');

      el.connectedCallback();

      const button = el.querySelector('button') as HTMLButtonElement;

      button.click();

      expect(el.onTestRun).calledOnce;
      expect(el.onTestRun).calledWith(new MouseEvent('click'), undefined, 'foo-bar');

      expect(el.badFn).not.called;
    });
  });
});
