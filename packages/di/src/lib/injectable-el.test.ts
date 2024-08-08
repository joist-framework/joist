import { test, assert } from 'vitest';

import { inject } from './inject.js';
import { injectable } from './injectable.js';

test('should allow services to be injected into custom element', () => {
  class Foo {}

  @injectable()
  class MyElement extends HTMLElement {
    foo = inject(Foo);
  }

  customElements.define('injectable-1', MyElement);

  const el = new MyElement();

  assert.instanceOf(el.foo(), Foo);
});

test('should allow services to be injected into custom elements that has been extended', () => {
  class Foo {}

  class MyBaseElement extends HTMLElement {}

  @injectable()
  class MyElement extends MyBaseElement {
    foo = inject(Foo);
  }

  customElements.define('injectable-2', MyElement);

  const el = new MyElement();

  assert.instanceOf(el.foo(), Foo);
});

test('should handle parent HTML Injectors', async () => {
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

  const el = document.createElement('div');
  el.innerHTML = /*html*/ `
    <injectable-parent-1>
      <injectable-child-1></injectable-child-1>
    </injectable-parent-1>
  `;

  document.body.append(el);

  const child = el.querySelector<Child>('injectable-child-1')!;

  assert.instanceOf(child.b().a(), AltA);

  el.remove();
});

test('should handle changing contexts', async () => {
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

  const el = document.createElement('div');
  el.innerHTML = /*html*/ `
    <div>
      <ctx-1>
        <ctx-child></ctx-child>
      </ctx-1>

      <ctx-2></ctx-2>
    </div>
  `;

  document.body.append(el);

  const ctx2 = el.querySelector('ctx-2')!;

  let child = el.querySelector<Child>('ctx-child')!;

  assert.instanceOf(child.a(), A);

  child.remove();

  ctx2.append(child);

  child = el.querySelector<Child>('ctx-child')!;

  assert.instanceOf(child.a(), AltA);
});
