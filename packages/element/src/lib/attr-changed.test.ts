import { assert } from "chai";
import { injectable, inject } from "@joist/di";
import { fixtureSync, html } from "@open-wc/testing";

import { attrChanged } from "./attr-changed.js";
import { attr } from "./attr.js";
import { element } from "./element.js";

it("should call specific attrbute callback", async () => {
  let args: string[] = [];

  @element({
    tagName: "attr-changed-1",
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
    tagName: "attr-changed-2",
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
    tagName: "attr-changed-3",
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

  const testbed = fixtureSync<LoggerElement>(html`
    <app-logger>
      <attr-changed-3></attr-changed-3>
    </app-logger>
  `);

  const el = testbed.querySelector<MyElement>("attr-changed-3");

  assert.isNotNull(testbed);
  assert.isNotNull(el);

  await Promise.resolve();

  assert.deepEqual(testbed.logs, ["test1:null:hello", "test2:null:world"]);
});
