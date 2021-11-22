import { expect } from '@open-wc/testing';
import { inject } from '@joist/di/decorators';

import { injectable } from './injectable';

describe('@injectable()', () => {
  it('should allow a custom element to be injected with deps (decorator)', () => {
    class Foo {}

    @injectable()
    class MyElement extends HTMLElement {
      constructor(@inject(Foo) public foo: Foo) {
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
      static get deps() {
        return [Foo];
      }

      constructor(public foo: Foo) {
        super();
      }
    }

    customElements.define('injectable-2', injectable()(MyElement));

    const el = document.createElement('injectable-2') as MyElement;

    expect(el.foo).to.be.instanceOf(Foo);
  });
});
