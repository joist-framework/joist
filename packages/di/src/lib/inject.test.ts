import { expect } from '@open-wc/testing';

import { inject } from './inject.js';
import { injectable } from './injectable.js';
import { Injector } from './injector.js';
import { StaticToken } from './provider.js';

describe('inject', () => {
  it('should work', () => {
    class HelloService {}

    @injectable
    class HelloWorld extends HTMLElement {
      hello = inject(HelloService);
    }

    customElements.define('inject-1', HelloWorld);

    expect(new HelloWorld().hello()).to.be.instanceOf(HelloService);
  });

  it('should throw error if called in constructor', () => {
    class FooService {
      value = '1';
    }

    @injectable
    class BarService {
      foo = inject(FooService);

      constructor() {
        this.foo();
      }
    }

    const parent = new Injector();

    try {
      parent.inject(BarService);

      throw new Error('Should not succeed');
    } catch (err) {
      const error = err as Error;

      expect(error.message).to.equal(
        `BarService is either not injectable or a service is being called in the constructor. \n Either add the @injectable to your class or use the [LifeCycle.onInject] callback method.`
      );
    }
  });

  it('should use the calling injector as parent', () => {
    class FooService {
      value = '1';
    }

    @injectable
    class BarService {
      foo = inject(FooService);
    }

    const parent = new Injector([
      {
        provide: FooService,
        use: class extends FooService {
          value = '100';
        }
      }
    ]);

    expect(parent.inject(BarService).foo().value).to.equal('100');
  });

  it('should inject a static toke', () => {
    const TOKEN = new StaticToken('test', () => 'Hello World');

    @injectable
    class HelloWorld extends HTMLElement {
      hello = inject(TOKEN);
    }

    customElements.define('inject-2', HelloWorld);

    expect(new HelloWorld().hello()).to.equal('Hello World');
  });
});
