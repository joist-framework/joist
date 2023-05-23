import { expect } from '@open-wc/testing';

import { inject } from './inject.js';
import { injectable } from './injectable.js';
import { Injector } from './injector.js';

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
        },
      },
    ]);

    expect(parent.get(BarService).foo().value).to.equal('100');
  });
});
