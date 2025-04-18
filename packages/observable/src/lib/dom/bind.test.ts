import { assert } from "chai";

import type { Changes } from "../metadata.js";
import { effect } from "../observe.js";
import { bind } from "./bind.js";

it("should work with instance accessors", () => {
  return new Promise<void>((resolve) => {
    class Counter extends HTMLElement {
      @bind()
      accessor value = 0;

      // confirm it works with private methods
      // @ts-ignore
      @effect() #onChange() {
        assert.equal(this.value, 1);

        resolve();
      }
    }

    customElements.define("counter-1", Counter);

    const counter = new Counter();

    assert.equal(counter.value, 0);

    counter.value++;

    assert.equal(counter.value, 1);
  });
});

it("should return a set of changed props", () => {
  return new Promise<void>((resolve) => {
    class Counter extends HTMLElement {
      @bind() accessor value = 0;

      @effect() onChange(changes: Changes<this>) {
        assert.deepEqual(changes.get("value"), {
          oldValue: 0,
          newValue: 1,
        });

        resolve();
      }
    }

    customElements.define("counter-2", Counter);

    const counter = new Counter();
    counter.value++;
  });
});

it("should upgrade custom elements", () => {
  return new Promise<void>((resolve) => {
    class Counter extends HTMLElement {
      @bind()
      accessor value = 0;

      constructor() {
        super();

        assert.equal(this.value, 100);
      }

      @effect() onChange() {
        assert.equal(this.value, 101);

        resolve();
      }
    }

    const el = document.createElement("counter-3") as Counter;
    el.value = 100;

    document.body.append(el);

    customElements.whenDefined("counter-3").then(() => {
      el.value++;
    });

    customElements.define("counter-3", Counter);
  });
});
