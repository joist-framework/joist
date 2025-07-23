import { assert } from "chai";

import { inject } from "../inject.js";
import { injectable } from "../injectable.js";
import { DOMInjector } from "./dom-injector.js";

it("should allow services to be injected into custom element", () => {
  class Foo {}

  @injectable()
  class MyElement extends HTMLElement {
    foo = inject(Foo);
  }

  customElements.define("injectable-1", MyElement);

  const el = new MyElement();

  assert.instanceOf(el.foo(), Foo);
});

it("should allow services to be injected into custom elements that has been extended", () => {
  class Foo {}

  class MyBaseElement extends HTMLElement {}

  @injectable()
  class MyElement extends MyBaseElement {
    foo = inject(Foo);
  }

  customElements.define("injectable-2", MyElement);

  const el = new MyElement();

  assert.instanceOf(el.foo(), Foo);
});

it("should handle parent HTML Injectors", async () => {
  @injectable()
  class A {}

  @injectable()
  class B {
    a = inject(A);
  }

  class AltA implements A {}

  @injectable({
    providers: [
      [B, { use: B }],
      [A, { use: AltA }],
    ],
  })
  class Parent extends HTMLElement {}

  @injectable()
  class Child extends HTMLElement {
    b = inject(B);
  }

  customElements.define("injectable-parent-1", Parent);
  customElements.define("injectable-child-1", Child);

  const el = document.createElement("div");
  el.innerHTML = /*html*/ `
    <injectable-parent-1>
      <injectable-child-1></injectable-child-1>
    </injectable-parent-1>
  `;

  document.body.append(el);

  const child = el.querySelector<Child>("injectable-child-1");

  assert.instanceOf(child?.b().a(), AltA);

  el.remove();
});

it("should handle changing contexts", async () => {
  class A {}
  class AltA implements A {}

  @injectable({
    providers: [[A, { use: A }]],
  })
  class Ctx1 extends HTMLElement {}

  @injectable({
    providers: [[A, { use: AltA }]],
  })
  class Ctx2 extends HTMLElement {}

  @injectable()
  class Child extends HTMLElement {
    a = inject(A);
  }

  customElements.define("ctx-1", Ctx1);
  customElements.define("ctx-2", Ctx2);
  customElements.define("ctx-child", Child);

  const el = document.createElement("div");
  el.innerHTML = /*html*/ `
    <div>
      <ctx-1>
        <ctx-child></ctx-child>
      </ctx-1>

      <ctx-2></ctx-2>
    </div>
  `;

  document.body.append(el);

  const ctx2 = el.querySelector("ctx-2");

  let child = el.querySelector<Child>("ctx-child");

  assert.instanceOf(child?.a(), A);

  child.remove();

  ctx2?.append(child);

  child = el.querySelector<Child>("ctx-child");

  assert.instanceOf(child?.a(), AltA);
});

it("should provide the same context in disconnectedCallback as connectedCallback", async () => {
  class A {}

  class AltA {}

  const app = new DOMInjector({
    providers: [[A, { use: AltA }]],
  });

  app.attach(document.body);

  @injectable()
  class Example extends HTMLElement {
    #ctx = inject(A);

    connected: A | null = null;
    disconnected: A | null = null;

    connectedCallback(): void {
      this.connected = this.#ctx();
    }

    disconnectedCallback(): void {
      this.disconnected = this.#ctx();
    }
  }

  customElements.define("ctx-3", Example);

  const el = document.createElement("ctx-3") as Example;

  document.body.append(el);

  assert.instanceOf(el.connected, AltA);

  el.remove();

  assert.instanceOf(el.disconnected, AltA);

  assert.equal(el.connected, el.disconnected);

  app.detach();
});

it("should call disconnectedCallback when element is removed from DOM", async () => {
  @injectable()
  class TestElement extends HTMLElement {
    connectedCalled = false;
    disconnectedCalled = false;

    connectedCallback(): void {
      this.connectedCalled = true;
    }

    disconnectedCallback(): void {
      this.disconnectedCalled = true;
    }
  }

  customElements.define("test-disconnect", TestElement);

  const el = new TestElement();

  // Initially, neither callback should have been called
  assert.isFalse(el.connectedCalled);
  assert.isFalse(el.disconnectedCalled);

  // Add to DOM - connectedCallback should be called
  document.body.append(el);
  assert.isTrue(el.connectedCalled);
  assert.isFalse(el.disconnectedCalled);

  // Remove from DOM - disconnectedCallback should be called
  el.remove();
  assert.isTrue(el.connectedCalled);
  assert.isTrue(el.disconnectedCalled);
});
