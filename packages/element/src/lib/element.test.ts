import { assert, expect } from "chai";
import { inject } from "@joist/di";

import { attr } from "./attr.js";
import { element } from "./element.js";
import { css, html } from "./tags.js";

it("should write default value to attribute", async () => {
  @element({
    tagName: "element-1",
  })
  class MyElement extends HTMLElement {
    @attr()
    accessor value1 = "hello"; // no attribute

    @attr()
    accessor value2 = 0; // number

    @attr()
    accessor value3 = true; // boolean

    @attr({ reflect: false })
    accessor value4 = "foo";
  }

  const el = new MyElement();

  document.body.append(el);

  expect(el.getAttribute("value1")).to.equal("hello");
  expect(el.getAttribute("value2")).to.equal("0");
  expect(el.getAttribute("value3")).to.equal("");
  expect(el.getAttribute("value4")).to.equal(null);

  el.remove();
});

it("should register attributes", async () => {
  const observedAttrs: string[] = [];

  @element({
    tagName: "element-2",
  })
  class MyElement extends HTMLElement {
    @attr()
    accessor value1 = "hello";

    @attr()
    accessor value2 = 0;

    @attr()
    accessor value3 = true;

    @attr({ observed: false })
    accessor value4 = "hello world";

    attributeChangedCallback(name: string) {
      observedAttrs.push(name);
    }
  }

  const el = new MyElement();

  el.setAttribute("value1", "foo");
  el.setAttribute("value2", "1");
  el.setAttribute("value3", "false");
  el.setAttribute("value4", "bar");

  expect(observedAttrs).to.deep.equal(["value1", "value2", "value3"]);
});

it("should attach shadow root when the shadow property exists", async () => {
  @element({
    tagName: "element-3",
    shadowDom: [],
  })
  class MyElement extends HTMLElement {}

  const el = new MyElement();

  expect(el.shadowRoot).to.be.instanceOf(ShadowRoot);
});

it("should apply html and css", async () => {
  @element({
    tagName: "element-4",
    shadowDom: [
      css`
        :host {
          display: contents;
        }
      `,
      html`<slot></slot>`,
      {
        apply(el) {
          const div = document.createElement("div");
          div.innerHTML = "hello world";

          el.append(div);
        },
      },
    ],
  })
  class MyElement extends HTMLElement {}

  const el = new MyElement();

  expect(el.shadowRoot?.adoptedStyleSheets.length).to.equal(1);
  expect(el.shadowRoot?.innerHTML).to.equal("<slot></slot>");
  expect(el.innerHTML).to.equal("<div>hello world</div>");
});

it("should the correct shadow dom mode", async () => {
  @element({
    tagName: "element-5",
    shadowDom: [],
    shadowDomOpts: {
      mode: "closed",
    },
  })
  class MyElement extends HTMLElement {}

  const el = new MyElement();

  assert.equal(el.shadowRoot, null);
});

it("should wait to register itself until all elements it depends on are also registered", async () => {
  @element({
    tagName: "element-6",
    dependsOn: ["element-7", "element-8"],
  })
  class MyElement6 extends HTMLElement {}

  assert.isUndefined(customElements.get("element-6"));

  customElements.define("element-7", class extends HTMLElement {});
  customElements.define("element-8", class extends HTMLElement {});

  await Promise.all([
    customElements.whenDefined("element-7"),
    customElements.whenDefined("element-8"),
  ]);

  assert.equal(customElements.get("element-6"), MyElement6);
});

it("should wait to register itself until the custom dependsOn function runs", async () => {
  let resolver: Function;

  @element({
    tagName: "element-9",
    dependsOn() {
      return new Promise((resolve) => {
        resolver = resolve;
      });
    },
  })
  class MyElement extends HTMLElement {}

  assert.isUndefined(customElements.get("element-9"));

  resolver!();

  await Promise.resolve();

  assert.equal(customElements.get("element-9"), MyElement);
});

it("should call disconnectedCallback when element is removed from DOM", async () => {
  let disconnectedCalled = false;

  @element({
    tagName: "element-10",
  })
  class MyElement extends HTMLElement {
    disconnectedCallback() {
      disconnectedCalled = true;
    }
  }

  const el = new MyElement();
  document.body.append(el);

  // Verify element is connected
  expect(disconnectedCalled).to.be.false;

  // Remove element from DOM
  el.remove();

  // Verify disconnectedCallback was called
  expect(disconnectedCalled).to.be.true;
});

it("should confirm that each element is injectable and can have services injected", () => {
  class ServiceA {}

  @element({
    tagName: "element-injectable-1",
  })
  class MyElement extends HTMLElement {
    serviceA = inject(ServiceA);
  }

  const el = new MyElement();
  expect(el.serviceA()).to.be.instanceOf(ServiceA);
});

it("should confirm that element decorator supports custom providers option", () => {
  class ServiceA {}
  class AltServiceA extends ServiceA {}

  @element({
    tagName: "element-injectable-2",
    providers: [[ServiceA, { use: AltServiceA }]],
  })
  class MyElement extends HTMLElement {
    serviceA = inject(ServiceA);
  }

  const el = new MyElement();
  expect(el.serviceA()).to.be.instanceOf(AltServiceA);
});

it("should confirm that element decorator supports DOM-based DI hierarchy", async () => {
  class ServiceA {}
  class AltServiceA extends ServiceA {}

  @element({
    tagName: "element-parent-di",
    providers: [[ServiceA, { use: AltServiceA }]],
  })
  class ParentElement extends HTMLElement {}

  @element({
    tagName: "element-child-di",
  })
  class ChildElement extends HTMLElement {
    serviceA = inject(ServiceA);
  }

  const container = document.createElement("div");
  container.innerHTML = /*html*/ `
    <element-parent-di>
      <element-child-di></element-child-di>
    </element-parent-di>
  `;

  document.body.append(container);

  const child = container.querySelector<ChildElement>("element-child-di");
  expect(child?.serviceA()).to.be.instanceOf(AltServiceA);

  container.remove();
});
