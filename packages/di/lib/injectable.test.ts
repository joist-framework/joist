import { expect } from '@open-wc/testing';

import { injectable } from './injectable';

describe('@injectable()', () => {
  it('should allow a custom element to be injected with deps (decorator)', () => {
    class Foo {}

    class Bar {}

    @injectable
    class MyElement extends HTMLElement {
      static inject = [Foo, Bar];

      constructor(public foo: Foo, public bar: Bar) {
        super();
      }
    }

    customElements.define('injectable-1', MyElement);

    const el = document.createElement('injectable-1') as MyElement;

    expect(el.foo).to.be.instanceOf(Foo);
  });

  it('should allow a custom element to be injected with deps (function)', () => {
    class Foo {}

    class MyElement extends HTMLElement {
      static inject = [Foo];

      constructor(public foo: Foo) {
        super();
      }
    }

    customElements.define('injectable-2', injectable(MyElement));

    const el = document.createElement('injectable-2') as MyElement;

    expect(el.foo).to.be.instanceOf(Foo);
  });

  it('should accept arguments if passed in manually (decorator)', () => {
    class Foo {}

    class Bar extends Foo {}

    @injectable
    class MyElement extends HTMLElement {
      static inject = [Foo];

      constructor(public foo: Foo) {
        super();
      }
    }

    customElements.define('injectable-3', MyElement);

    const el = new MyElement(new Bar());

    expect(el.foo).to.be.instanceOf(Bar);
  });

  it('should locally override a provider', () => {
    class Foo {}

    class Bar extends Foo {}

    @injectable
    class MyElement extends HTMLElement {
      static inject = [Foo];
      static providers = [{ provide: Foo, use: Bar }];

      constructor(public foo: Foo) {
        super();
      }
    }

    customElements.define('injectable-4', MyElement);

    const el = document.createElement('injectable-4') as MyElement;

    expect(el.foo).to.be.instanceOf(Bar);
  });
});
