import { expect, fixture, html } from '@open-wc/testing';

import { injectable } from './injectable.js';
import { inject } from './inject.js';
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

    const MyElement = injectable(
      class {
        static providers = [{ provide: Foo, use: Bar }];

        foo = inject(Foo);
      }
    );

    const el = new MyElement();

    expect(el.foo()).to.be.instanceOf(Bar);
  });

  it('should handle parent HTML Injectors', async () => {
    @injectable
    class A {}

    const B = injectable(
      class {
        a = inject(A);
      }
    );

    class AltA implements A {}

    @injectable
    class Parent extends HTMLElement {
      static providers = [
        { provide: B, use: B },
        { provide: A, use: AltA }
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

  it('should handle changing contexts', async () => {
    class A {}
    class AltA implements A {}

    @injectable
    class Ctx1 extends HTMLElement {
      static providers = [{ provide: A, use: A }];
    }

    @injectable
    class Ctx2 extends HTMLElement {
      static providers = [{ provide: A, use: AltA }];
    }

    @injectable
    class Child extends HTMLElement {
      a = inject(A);
    }

    customElements.define('ctx-1', Ctx1);
    customElements.define('ctx-2', Ctx2);
    customElements.define('ctx-child', Child);

    const el = await fixture(html`
      <div>
        <ctx-1>
          <ctx-child></ctx-child>
        </ctx-1>

        <ctx-2></ctx-2>
      </div>
    `);

    const ctx2 = el.querySelector('ctx-2')!;

    let child = el.querySelector<Child>('ctx-child')!;

    expect(child.a()).to.be.instanceOf(A);

    child.remove();

    ctx2.append(child);

    child = el.querySelector<Child>('ctx-child')!;

    expect(child.a()).to.be.instanceOf(AltA);
  });
});
