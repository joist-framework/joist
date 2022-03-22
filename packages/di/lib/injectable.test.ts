import { expect, fixture, html } from '@open-wc/testing';

import { injectable, Injected } from './injectable';

describe('@injectable()', () => {
  it('should allow a custom element to be injected with deps (decorator)', () => {
    class Foo {}

    class Bar {}

    @injectable
    class MyElement extends HTMLElement {
      static inject = [Foo, Bar];

      constructor(public foo: Injected<Foo>, public bar: Injected<Bar>) {
        super();
      }
    }

    customElements.define('injectable-1', MyElement);

    const el = document.createElement('injectable-1') as MyElement;

    expect(el.foo()).to.be.instanceOf(Foo);
  });

  it('should allow a custom element to be injected with deps (function)', () => {
    class Foo {}

    class MyElement extends HTMLElement {
      static inject = [Foo];

      constructor(public foo: Injected<Foo>) {
        super();
      }
    }

    customElements.define('injectable-2', injectable(MyElement));

    const el = document.createElement('injectable-2') as MyElement;

    expect(el.foo()).to.be.instanceOf(Foo);
  });

  it('should accept arguments if passed in manually (decorator)', () => {
    class Foo {}

    class Bar extends Foo {}

    @injectable
    class MyElement extends HTMLElement {
      static inject = [Foo];

      constructor(public foo: Injected<Foo>) {
        super();
      }
    }

    customElements.define('injectable-3', MyElement);

    const el = new MyElement(() => new Bar());

    expect(el.foo()).to.be.instanceOf(Bar);
  });

  it('should locally override a provider', () => {
    class Foo {}

    class Bar extends Foo {}

    @injectable
    class MyElement extends HTMLElement {
      static inject = [Foo];
      static providers = [{ provide: Foo, use: Bar }];

      constructor(public foo: Injected<Foo>) {
        super();
      }
    }

    customElements.define('injectable-4', MyElement);

    const el = document.createElement('injectable-4') as MyElement;

    expect(el.foo()).to.be.instanceOf(Bar);
  });

  it('should handle parent HTML Injectors', async () => {
    class Foo {
      sayHello() {
        return 'Hello World';
      }
    }

    @injectable
    class Parent extends HTMLElement {
      static providers = [
        {
          provide: Foo,
          use: class extends Foo {
            sayHello() {
              return 'Goodbye World';
            }
          },
        },
      ];
    }

    @injectable
    class Child extends HTMLElement {
      static inject = [Foo];

      constructor(public foo: Injected<Foo>) {
        super();
      }
    }

    customElements.define('injectable-parent-1', Parent);
    customElements.define('injectable-child-1', Child);

    const el = await fixture(html`
      <injectable-parent-1>
        <injectable-child-1></injectable-child-1>
      </injectable-parent-1>
    `);

    const child = el.querySelector<Child>('injectable-child-1')!;

    expect(child.foo().sayHello()).to.equal('Goodbye World');
  });
});
