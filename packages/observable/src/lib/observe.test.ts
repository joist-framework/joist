import { assert } from "chai";

import type { Changes } from "./metadata.js";
import { effect, observe } from "./observe.js";

it("should work with static accessors", () => {
  return new Promise<void>((resolve) => {
    // biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
    class Counter {
      @observe()
      static accessor value = 0;

      @effect() static onPropChanged() {
        assert.equal(Counter.value, 1);

        resolve();
      }
    }

    assert.equal(Counter.value, 0);

    Counter.value++;

    assert.equal(Counter.value, 1);
  });
});

it("should work with instance accessors", () => {
  return new Promise<void>((resolve) => {
    class Counter {
      @observe()
      accessor value = 0;

      // confirm it works with private methods
      // @ts-ignore
      @effect() #onChange() {
        assert.equal(this.value, 1);

        resolve();
      }
    }

    const counter = new Counter();

    assert.equal(counter.value, 0);

    counter.value++;

    assert.equal(counter.value, 1);
  });
});

it("should return a set of changed props", () => {
  return new Promise<void>((resolve) => {
    class Counter {
      @observe() accessor value = 0;

      @effect() onChange(changes: Changes<this>) {
        assert.deepEqual(changes.get("value"), {
          oldValue: 0,
          newValue: 1,
        });

        resolve();
      }
    }

    const counter = new Counter();
    counter.value++;
  });
});

it("should upgrade custom elements", () => {
  return new Promise<void>((resolve) => {
    class Counter extends HTMLElement {
      @observe()
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

    const el = document.createElement("observable-1") as Counter;
    el.value = 100;

    document.body.append(el);

    customElements.whenDefined("observable-1").then(() => {
      el.value++;
    });

    customElements.define("observable-1", Counter);
  });
});

describe("computed decorator", () => {
  it("should compute values based on other properties", async () => {
    class TestClass {
      @observe()
      accessor firstName = "John";

      @observe()
      accessor lastName = "Doe";

      @observe({
        compute: (i) => `${i.firstName} ${i.lastName}`,
      })
      accessor fullName = "";
    }

    const instance = new TestClass();
    assert.equal(instance.fullName, "John Doe");

    // Update dependencies
    instance.firstName = "Jane";

    await Promise.resolve();

    assert.equal(instance.fullName, "Jane Doe");
  });

  it("should handle multiple computed properties", async () => {
    class TestClass {
      @observe()
      accessor x = 2;

      @observe()
      accessor y = 3;

      @observe({
        compute: (i) => i.x + i.y,
      })
      accessor sum = 0;

      @observe({
        compute: (i) => i.x * i.y,
      })
      accessor product = 0;
    }

    const instance = new TestClass();
    assert.equal(instance.sum, 5);
    assert.equal(instance.product, 6);

    // Update dependencies
    instance.x = 4;

    await Promise.resolve();

    assert.equal(instance.sum, 7);
    assert.equal(instance.product, 12);
  });
});
