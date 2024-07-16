import { expect, fixture, html } from '@open-wc/testing';
import { inject, injectable } from '@joist/di';

import { attr } from './attr.js';
import { element } from './element.js';
import { tagName } from './tag-name.js';

describe('@element()', () => {
  it('should write default value to attribute', async () => {
    @element
    class MyElement extends HTMLElement {
      @tagName static tag = 'element-1';

      @attr accessor value1 = 'hello'; // no attribute
      @attr accessor value2 = 0; // number
      @attr accessor value3 = true; // boolean
    }

    const el = await fixture<MyElement>(html`<element-1></element-1>`);

    expect(el.getAttribute('value1')).to.equal('hello');
    expect(el.getAttribute('value2')).to.equal('0');
    expect(el.getAttribute('value3')).to.equal('');
  });

  it('should handle parent HTML Injectors', async () => {
    @injectable
    class A {}

    @injectable
    class B {
      a = inject(A);
    }

    class AltA implements A {}

    @element
    class Parent extends HTMLElement {
      static providers = [
        { provide: B, use: B },
        { provide: A, use: AltA }
      ];
    }

    @element
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

    @element
    class Ctx1 extends HTMLElement {
      static providers = [{ provide: A, use: A }];
    }

    @element
    class Ctx2 extends HTMLElement {
      static providers = [{ provide: A, use: AltA }];
    }

    @element
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
