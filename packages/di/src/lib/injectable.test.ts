import { assert } from 'chai';
import { fixture, html } from '@open-wc/testing';

import { injectable } from './injectable.js';
import { inject } from './inject.js';

it('should locally override a provider', () => {
  class Foo {}

  class Bar extends Foo {}

  @injectable({
    providers: [{ provide: Foo, use: Bar }]
  })
  class MyService {
    foo = inject(Foo);
  }

  const el = new MyService();

  assert.instanceOf(el.foo(), Bar);
});

describe('Custom Elements', () => {
  it('should allow services to be injected into deps', () => {
    class Foo {}

    @injectable()
    class MyElement extends HTMLElement {
      foo = inject(Foo);
    }

    customElements.define('injectable-1', MyElement);

    const el = new MyElement();

    assert.instanceOf(el.foo(), Foo);
  });

  it('should handle parent HTML Injectors', async () => {
    @injectable()
    class A {}

    @injectable()
    class B {
      a = inject(A);
    }

    class AltA implements A {}

    @injectable({
      providers: [
        { provide: B, use: B },
        { provide: A, use: AltA }
      ]
    })
    class Parent extends HTMLElement {}

    @injectable()
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

    assert.instanceOf(child.b().a(), AltA);
  });

  it('should handle changing contexts', async () => {
    class A {}
    class AltA implements A {}

    @injectable({
      providers: [{ provide: A, use: A }]
    })
    class Ctx1 extends HTMLElement {}

    @injectable({
      providers: [{ provide: A, use: AltA }]
    })
    class Ctx2 extends HTMLElement {}

    @injectable()
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

    assert.instanceOf(child.a(), A);

    child.remove();

    ctx2.append(child);

    child = el.querySelector<Child>('ctx-child')!;

    assert.instanceOf(child.a(), AltA);
  });
});
