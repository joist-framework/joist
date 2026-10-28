import { assert } from "chai";
import { injectable, inject } from "@joist/di";

import { attrChanged } from "./attr-changed.js";
import { attr } from "./attr.js";
import { element } from "./element.js";

let counter = 0;
let tagName = `attr-changed-${counter}`;

beforeEach(() => {
  tagName = `attr-changed-${counter++}`;
});

it("should call specific attribute callback", async () => {
  let args: string[] = [];

  @element({
    tagName,
  })
  class MyElement extends HTMLElement {
    @attr()
    accessor test = "hello";

    @attrChanged("test")
    onTestChanged(name: string, oldValue: string, newValue: string) {
      args = [name, oldValue, newValue];
    }
  }

  const el = new MyElement();

  document.body.append(el);

  await Promise.resolve();

  assert.deepEqual(args, ["test", null, "hello"]);

  el.setAttribute("test", "world");

  await Promise.resolve();

  assert.deepEqual(args, ["test", "hello", "world"]);

  el.remove();
});

it("should call callback for multiple attributes", async () => {
  const args: string[][] = [];

  @element({
    tagName,
  })
  class MyElement extends HTMLElement {
    @attr()
    accessor test1 = "hello";

    @attr()
    accessor test2 = "world";

    @attrChanged("test1", "test2")
    onTestChanged(attr: string, oldValue: string, newValue: string) {
      args.push([attr, oldValue, newValue]);
    }
  }

  const el = new MyElement();

  document.body.append(el);

  await Promise.resolve();

  assert.deepEqual(args, [
    ["test1", null, "hello"],
    ["test2", null, "world"],
  ]);

  el.setAttribute("test1", "world");

  await Promise.resolve();

  assert.deepEqual(args, [
    ["test1", null, "hello"],
    ["test2", null, "world"],
    ["test1", "hello", "world"],
  ]);

  el.remove();
});

it("should not trigger callback until the element has been attached and given an injector", async () => {
  @injectable()
  class Logger {
    log(arg: string) {
      throw new Error("Not implemented");
    }
  }

  @element({
    tagName: "app-logger",
    provideSelfAs: [Logger],
  })
  class LoggerElement extends HTMLElement implements Logger {
    logs: string[] = [];

    log(message: any) {
      this.logs.push(message);
    }
  }

  @element({
    tagName,
  })
  class MyElement extends HTMLElement {
    #logger = inject(Logger);

    @attr()
    accessor test1 = "hello";

    @attr()
    accessor test2 = "world";

    @attrChanged("test1", "test2")
    onTestChanged(attr: string, oldValue: string, newValue: string) {
      const logger = this.#logger();

      logger.log(`${attr}:${oldValue}:${newValue}`);
    }
  }

  const container = document.createElement("div");
  container.innerHTML = `<app-logger><${tagName}></${tagName}></app-logger>`;
  document.body.append(container);

  const testbed = container.querySelector<LoggerElement>("app-logger");
  const el = container.querySelector<MyElement>(tagName);

  assert.isNotNull(testbed);
  assert.isNotNull(el);

  await Promise.resolve();

  assert.deepEqual(testbed?.logs, ["test1:null:hello", "test2:null:world"]);

  container.remove();
});

it("should not trigger callback when attribute is set before element is attached to DOM", async () => {
  const args: string[][] = [];

  @element({
    tagName,
  })
  class MyElement extends HTMLElement {
    @attr()
    accessor test = "hello";

    @attrChanged("test")
    onTestChanged(name: string, oldValue: string, newValue: string) {
      args.push([name, oldValue, newValue]);
    }
  }

  const el = new MyElement();
  el.setAttribute("test", "pre-attach");

  assert.equal(el.test, "pre-attach");
  assert.deepEqual(args, []);

  document.body.append(el);
  await Promise.resolve();

  assert.deepEqual(args, [["test", null, "pre-attach"]]);

  el.remove();
});

it("should safely access injected service when attribute is changed before attachment", async () => {
  @injectable()
  class Service {
    value = "service-ready";
  }

  let capturedServiceValue: string | null = null;

  @element({
    tagName: "test-service-provider",
    provideSelfAs: [Service],
  })
  class ProviderElement extends HTMLElement implements Service {
    value = "service-ready";
  }

  @element({
    tagName,
  })
  class MyElement extends HTMLElement {
    #service = inject(Service);

    @attr()
    accessor test = "initial";

    @attrChanged("test")
    onTestChanged(name: string, oldValue: string, newValue: string) {
      capturedServiceValue = `${this.#service().value}:${name}:${oldValue}:${newValue}`;
    }
  }

  const el = new MyElement();
  el.setAttribute("test", "updated-before-attach");

  assert.isNull(capturedServiceValue);

  const provider = document.createElement("test-service-provider") as ProviderElement;
  provider.append(el);
  document.body.append(provider);

  await Promise.resolve();

  assert.equal(capturedServiceValue, "service-ready:test:null:updated-before-attach");

  provider.remove();
});

it("should pause callbacks when element is disconnected and run them upon reconnection", async () => {
  const args: string[][] = [];

  @element({
    tagName,
  })
  class MyElement extends HTMLElement {
    @attr()
    accessor test = "initial";

    @attrChanged("test")
    onTestChanged(name: string, oldValue: string, newValue: string) {
      args.push([name, oldValue, newValue]);
    }
  }

  const el = new MyElement();
  document.body.append(el);
  await Promise.resolve();

  assert.deepEqual(args, [["test", null, "initial"]]);

  el.remove();

  el.setAttribute("test", "disconnected-value");
  await Promise.resolve();

  assert.deepEqual(args, [["test", null, "initial"]]);

  document.body.append(el);
  await Promise.resolve();

  assert.deepEqual(args, [
    ["test", null, "initial"],
    ["test", "initial", "disconnected-value"],
  ]);

  el.setAttribute("test", "after-reconnect");
  await Promise.resolve();

  assert.deepEqual(args, [
    ["test", null, "initial"],
    ["test", "initial", "disconnected-value"],
    ["test", "disconnected-value", "after-reconnect"],
  ]);

  el.remove();
});

it("should safely access injected service after disconnect and reconnect", async () => {
  @injectable()
  class CounterService {
    calls = 0;
    record() {
      return ++this.calls;
    }
  }

  const history: string[] = [];

  @element({
    tagName: "test-counter-provider",
    provideSelfAs: [CounterService],
  })
  class ProviderElement extends HTMLElement implements CounterService {
    calls = 0;
    record() {
      return ++this.calls;
    }
  }

  @element({
    tagName,
  })
  class MyElement extends HTMLElement {
    #counter = inject(CounterService);

    @attr()
    accessor val = "0";

    @attrChanged("val")
    onValChanged(name: string, oldValue: string, newValue: string) {
      const count = this.#counter().record();
      history.push(`${name}:${oldValue}:${newValue}:call#${count}`);
    }
  }

  const provider = document.createElement("test-counter-provider") as ProviderElement;
  const el = new MyElement();
  provider.append(el);
  document.body.append(provider);

  await Promise.resolve();

  assert.deepEqual(history, ["val:null:0:call#1"]);

  el.remove();

  el.setAttribute("val", "1");
  await Promise.resolve();

  assert.equal(history.length, 1);

  provider.append(el);
  await Promise.resolve();

  assert.deepEqual(history, ["val:null:0:call#1", "val:0:1:call#2"]);

  provider.remove();
});

it("should trigger callback when attribute is removed", async () => {
  const args: (string | null)[][] = [];

  @element({
    tagName,
  })
  class MyElement extends HTMLElement {
    @attr()
    accessor test = "initial";

    @attrChanged("test")
    onTestChanged(name: string, oldValue: string, newValue: string) {
      args.push([name, oldValue, newValue]);
    }
  }

  const el = new MyElement();
  document.body.append(el);
  await Promise.resolve();

  assert.deepEqual(args, [["test", null, "initial"]]);

  el.removeAttribute("test");
  await Promise.resolve();

  assert.deepEqual(args, [
    ["test", null, "initial"],
    ["test", "initial", null],
  ]);

  el.remove();
});

it("should call specific attribute callback that uses RegExp", async () => {
  let args: string[][] = [];

  @element({
    tagName,
  })
  class MyElement extends HTMLElement {
    @attr()
    accessor test_1 = "hello";

    @attr()
    accessor test_2 = "world";

    @attrChanged(/test_.*/)
    onTestChanged(name: string, oldValue: string, newValue: string) {
      args.push([name, oldValue, newValue]);
    }
  }

  const el = new MyElement();

  document.body.append(el);

  await Promise.resolve();

  assert.deepEqual(args, [
    ["test_1", null, "hello"],
    ["test_2", null, "world"],
  ]);

  el.remove();
});

it("should trigger RegExp callback on dynamic attribute changes after attachment", async () => {
  const args: string[][] = [];

  @element({
    tagName,
  })
  class MyElement extends HTMLElement {
    @attr({ name: "data-id" })
    accessor dataId = "100";

    @attr({ name: "data-name" })
    accessor dataName = "test-name";

    @attrChanged(/^data-.*/)
    onDataChanged(name: string, oldValue: string, newValue: string) {
      args.push([name, oldValue, newValue]);
    }
  }

  const el = new MyElement();
  document.body.append(el);
  await Promise.resolve();

  assert.deepEqual(args, [
    ["data-id", null, "100"],
    ["data-name", null, "test-name"],
  ]);

  el.setAttribute("data-id", "200");
  await Promise.resolve();

  assert.deepEqual(args, [
    ["data-id", null, "100"],
    ["data-name", null, "test-name"],
    ["data-id", "100", "200"],
  ]);

  el.setAttribute("data-name", "updated-name");
  await Promise.resolve();

  assert.deepEqual(args, [
    ["data-id", null, "100"],
    ["data-name", null, "test-name"],
    ["data-id", "100", "200"],
    ["data-name", "test-name", "updated-name"],
  ]);

  el.remove();
});

it("should NOT trigger RegExp callback when an unmatching attribute changes", async () => {
  const regexCalls: string[][] = [];
  const stringCalls: string[][] = [];

  @element({
    tagName,
  })
  class MyElement extends HTMLElement {
    @attr({ name: "col-span" })
    accessor colSpan = "1";

    @attr()
    accessor title = "default";

    @attrChanged(/^col-.*/)
    onColChanged(name: string, oldValue: string, newValue: string) {
      regexCalls.push([name, oldValue, newValue]);
    }

    @attrChanged("title")
    onTitleChanged(name: string, oldValue: string, newValue: string) {
      stringCalls.push([name, oldValue, newValue]);
    }
  }

  const el = new MyElement();
  document.body.append(el);
  await Promise.resolve();

  assert.deepEqual(regexCalls, [["col-span", null, "1"]]);
  assert.deepEqual(stringCalls, [["title", null, "default"]]);

  el.setAttribute("title", "new title");
  await Promise.resolve();

  assert.deepEqual(regexCalls, [["col-span", null, "1"]]);
  assert.deepEqual(stringCalls, [
    ["title", null, "default"],
    ["title", "default", "new title"],
  ]);

  el.setAttribute("col-span", "3");
  await Promise.resolve();

  assert.deepEqual(regexCalls, [
    ["col-span", null, "1"],
    ["col-span", "1", "3"],
  ]);
  assert.deepEqual(stringCalls, [
    ["title", null, "default"],
    ["title", "default", "new title"],
  ]);

  el.remove();
});

it("should support mixing string and RegExp matchers in a single @attrChanged", async () => {
  const args: string[][] = [];

  @element({
    tagName,
  })
  class MyElement extends HTMLElement {
    @attr()
    accessor active = "false";

    @attr({ name: "data-val" })
    accessor dataVal = "val";

    @attr()
    accessor other = "ignored";

    @attrChanged("active", /^data-.*/)
    onMatched(name: string, oldValue: string, newValue: string) {
      args.push([name, oldValue, newValue]);
    }
  }

  const el = new MyElement();
  document.body.append(el);
  await Promise.resolve();

  assert.deepEqual(args, [
    ["active", null, "false"],
    ["data-val", null, "val"],
  ]);

  el.setAttribute("other", "changed");
  await Promise.resolve();
  assert.equal(args.length, 2);

  el.setAttribute("active", "true");
  await Promise.resolve();
  assert.deepEqual(args[2], ["active", "false", "true"]);

  el.setAttribute("data-val", "new-val");
  await Promise.resolve();
  assert.deepEqual(args[3], ["data-val", "val", "new-val"]);

  el.remove();
});

it("should trigger callbacks in sequence for multiple changes made before attachment", async () => {
  const args: string[][] = [];

  @element({
    tagName,
  })
  class MyElement extends HTMLElement {
    @attr()
    accessor test = "initial";

    @attrChanged("test")
    onTestChanged(name: string, oldValue: string, newValue: string) {
      args.push([name, oldValue, newValue]);
    }
  }

  const el = new MyElement();
  el.setAttribute("test", "first");
  el.setAttribute("test", "second");
  el.setAttribute("test", "third");

  document.body.append(el);
  await Promise.resolve();

  assert.deepEqual(args, [
    ["test", null, "first"],
    ["test", "first", "second"],
    ["test", "second", "third"],
  ]);

  el.remove();
});

it("should work correctly with typed boolean and number attributes", async () => {
  const args: string[][] = [];
  let capturedCount: number | null = null;
  let capturedActive: boolean | null = null;

  @element({
    tagName,
  })
  class MyElement extends HTMLElement {
    @attr({ type: Number })
    accessor count = 10;

    @attr({ type: Boolean })
    accessor active = false;

    @attrChanged("count", "active")
    onChanged(name: string, oldValue: string, newValue: string) {
      args.push([name, oldValue, newValue]);
      capturedCount = this.count;
      capturedActive = this.active;
    }
  }

  const el = new MyElement();
  document.body.append(el);
  await Promise.resolve();

  assert.deepEqual(args, [["count", null, "10"]]);

  el.setAttribute("count", "42");
  await Promise.resolve();

  assert.equal(capturedCount, 42);
  assert.deepEqual(args[1], ["count", "10", "42"]);

  el.setAttribute("active", "");
  await Promise.resolve();

  assert.equal(capturedActive, true);
  assert.deepEqual(args[2], ["active", null, ""]);

  el.removeAttribute("active");
  await Promise.resolve();

  assert.equal(capturedActive, false);
  assert.deepEqual(args[3], ["active", "", null]);

  el.remove();
});

it("should correctly bind 'this' to the element instance inside the callback", async () => {
  let instanceInCallback: any = null;

  @element({
    tagName,
  })
  class MyElement extends HTMLElement {
    @attr()
    accessor test = "hello";

    customMethod() {
      return "works";
    }

    @attrChanged("test")
    onTestChanged() {
      instanceInCallback = this;
    }
  }

  const el = new MyElement();
  document.body.append(el);
  await Promise.resolve();

  assert.equal(instanceInCallback, el);
  assert.equal(instanceInCallback.customMethod(), "works");

  el.remove();
});

it("should invoke multiple methods decorated with @attrChanged for the same attribute", async () => {
  const calls: string[] = [];

  @element({
    tagName,
  })
  class MyElement extends HTMLElement {
    @attr()
    accessor test = "hello";

    @attrChanged("test")
    onFirst() {
      calls.push("first");
    }

    @attrChanged("test")
    onSecond() {
      calls.push("second");
    }
  }

  const el = new MyElement();
  document.body.append(el);
  await Promise.resolve();

  assert.deepEqual(calls, ["first", "second"]);

  el.setAttribute("test", "world");
  await Promise.resolve();

  assert.deepEqual(calls, ["first", "second", "first", "second"]);

  el.remove();
});
