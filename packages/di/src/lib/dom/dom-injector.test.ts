import { assert } from "chai";

import { INJECTOR_CTX } from "../context/injector.js";
import { ContextRequestEvent, type UnknownContext } from "../context/protocol.js";
import { Injector } from "../injector.js";
import { DOMInjector } from "./dom-injector.js";
import { readInjector } from "../metadata.js";
import { injectable } from "../injectable.js";
import { inject } from "../inject.js";

it("should respond to elements looking for an injector", () => {
  const injector = new DOMInjector();
  injector.attach(document.body);

  const host = document.createElement("div");
  document.body.append(host);

  let parent: Injector | null = null;

  host.dispatchEvent(
    new ContextRequestEvent(INJECTOR_CTX, (i) => {
      parent = i;
    }),
  );

  assert.equal(parent, injector);

  injector.detach();
  host.remove();
});

it("should send request looking for other injector contexts", () => {
  const parent = new Injector();
  const injector = new DOMInjector();

  const cb = (e: ContextRequestEvent<UnknownContext>) => {
    if (e.context === INJECTOR_CTX) {
      e.callback(parent);
    }
  };

  document.body.addEventListener("context-request", cb);

  injector.attach(document.body);

  assert.equal(injector.parent, parent);

  injector.detach();
  document.body.removeEventListener("context-request", cb);
});

it("should throw an error if attempting to attach an already attached DOMInjector", () => {
  const injector = new DOMInjector();

  const el = document.createElement("div");

  injector.attach(el);

  assert.throw(() => {
    injector.attach(el);
  });
});

it("should correctly add injector to the target element", () => {
  const injector = new DOMInjector();

  injector.attach(document.body);

  assert.instanceOf(readInjector(document.body), DOMInjector);
  assert.equal(readInjector(document.body), injector);

  injector.detach();
});

it("should apply parent to child", (done) => {
  class TestConfig {
    path = "/foo";
  }

  const injector = new DOMInjector({
    providers: [[TestConfig, { factory: () => ({ path: "/bar" }) }]],
  });

  injector.attach(document.body);

  @injectable()
  class MyElement extends HTMLElement {
    #config = inject(TestConfig);

    connectedCallback(): void {
      const config = this.#config();
      assert.equal(config.path, "/bar");

      done();
    }
  }

  customElements.define("dom-injector-test", MyElement);

  const child = new MyElement();

  document.body.append(child);

  child.remove();
  injector.detach();
});
