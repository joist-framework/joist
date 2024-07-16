import { expect } from '@open-wc/testing';

import { injectable } from './injectable.js';
import { inject } from './inject.js';
import { Injector } from './injector.js';

describe('@injectable()', () => {
  it('should locally override a provider', () => {
    class Foo {}

    class Bar extends Foo {}

    const MyElement = injectable(
      class {
        static providers = [{ provide: Foo, use: Bar }];

        foo = inject(Foo);
      }
    );

    const el = new MyElement();

    expect(el.foo()).to.be.instanceOf(Bar);
  });

  it('should call the onInject lifecycle hook', (done) => {
    class A {}

    @injectable
    class B {
      a = inject(A);

      onInject() {
        expect(this.a()).to.be.instanceOf(A);

        done();
      }
    }

    new Injector().get(B);
  });
});
