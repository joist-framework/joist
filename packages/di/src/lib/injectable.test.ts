import { expect, fixture, html } from '@open-wc/testing';

import { injectable } from './injectable.js';
import { Inject, inject } from './inject.js';
import { Injector } from './injector.js';

describe('@injectable()', () => {
  it('should allow a custom element to be injected with deps', () => {
    class Foo {}
    class Bar {}

    @injectable
    class MyElement extends HTMLElement {
      foo = inject(Foo);
      bar = inject(Bar);
    }

    customElements.define('injectable-1', MyElement);

    const el = document.createElement('injectable-1') as MyElement;

    expect(el.foo()).to.be.instanceOf(Foo);
  });

  it('should locally override a provider', () => {
    class Foo {}

    class Bar extends Foo {}

    @injectable
    class MyElement extends HTMLElement {
      static providers = [{ provide: Foo, use: Bar }];

      foo = inject(Foo);
    }

    customElements.define('injectable-4', MyElement);

    const el = document.createElement('injectable-4') as MyElement;

    expect(el.foo()).to.be.instanceOf(Bar);
  });

  it('should provide a usable inject function in the constructor', () => {
    class A {}

    @injectable
    class B {
      a: A;

      constructor(inject: Inject) {
        this.a = inject(A)();
      }
    }

    new Injector().get(B);
  });

  it('should handle parent HTML Injectors', async () => {
    class A {
      static service = true;
    }

    @injectable
    class B {
      static service = true;

      a = inject(A);
    }

    class AltA implements A {}

    @injectable
    class Parent extends HTMLElement {
      static providers = [
        { provide: B, use: B },
        { provide: A, use: AltA },
      ];
    }

    @injectable
    class Child extends HTMLElement {
      b = inject(B);
    }

    customElements.define('injectable-parent-1', Parent);
    customElements.define('injectable-child-1', Child);

    const el = await fixture(html`
      <injectable-parent-1>
        <injectable-child-1></injectable-child-1>
      </injectable-parent-1>
    `);

    const child = el.querySelector<Child>('injectable-child-1')!;

    expect(child.b().a()).to.be.instanceOf(AltA);
  });
});
