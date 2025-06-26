import { assert } from "chai";

import { INJECTOR_CTX } from "../context/injector.js";
import { ContextRequestEvent, type UnknownContext } from "../context/protocol.js";
import { Injector } from "../injector.js";
import { DOMInjector } from "./dom-injector.js";
import { readInjector } from "../metadata.js";

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
