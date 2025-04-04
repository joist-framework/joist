import { assert } from "chai";

import { attrChanged } from "./attr-changed.js";
import { attr } from "./attr.js";
import { element } from "./element.js";

it("should call specific attrbute callback", () => {
  let args: string[] = [];

  @element({
    tagName: "attr-changed-1",
  })
  class MyElement extends HTMLElement {
    @attr()
    accessor test = "hello";

    @attrChanged("test")
    onTestChanged(name: string, oldValue: string, newValue: string) {
      console.log("onTestChanged", name, oldValue, newValue);
      args = [name, oldValue, newValue];
    }
  }

  const el = new MyElement();

  document.body.append(el);

  assert.deepEqual(args, ["test", null, "hello"]);

  el.setAttribute("test", "world");

  assert.deepEqual(args, ["test", "hello", "world"]);

  el.remove();
});

it("should call callback for multiple attributes", () => {
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

  assert.deepEqual(args, [
    ["test1", null, "hello"],
    ["test2", null, "world"],
  ]);

  el.setAttribute("test1", "world");

  assert.deepEqual(args, [
    ["test1", null, "hello"],
    ["test2", null, "world"],
    ["test1", "hello", "world"],
  ]);

  el.remove();
});
