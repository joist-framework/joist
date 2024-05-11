import { expect, fixture, html } from "@open-wc/testing";

import { Injector } from "./injector.js";
import { environment, clearEnvironment } from "./environment.js";
import { injectable } from "./injectable.js";
import { inject } from "./inject.js";

describe("environment", () => {
  afterEach(clearEnvironment);

  it("should create a global Injector instance", () => {
    expect(environment()).to.be.instanceOf(Injector);
  });

  it("should use the root injector when creating services", async () => {
    @injectable
    class MyService {}

    @injectable
    class MyElement extends HTMLElement {
      my = inject(MyService);
    }

    customElements.define("env-1", MyElement);

    const el = await fixture<MyElement>(html`<env-1></env-1>`);

    expect(el.my()).to.equal(environment().get(MyService));
  });
});
