import { assert } from "chai";
import { bind } from "./bind.js";
import { JoistValueEvent } from "./events.js";
import { JExpression } from "./expression.js";

describe("bind decorator", () => {
  class TestElement extends HTMLElement {
    @bind()
    accessor value = "initial";

    @bind({ alwaysUpdate: true })
    accessor alwaysUpdateValue = "initial";
  }

  customElements.define("test-element", TestElement);

  it("should initialize with default value", () => {
    const element = new TestElement();
    assert.equal(element.value, "initial");
  });

  it("should update value and trigger binding", async () => {
    const element = new TestElement();
    let oldValue: unknown = null;
    let newValue: unknown = null;

    element.dispatchEvent(
      new JoistValueEvent(new JExpression("value"), (update) => {
        oldValue = update.oldValue;
        newValue = update.newValue;
      }),
    );

    assert.equal(oldValue, null);
    assert.equal(newValue, "initial");

    element.value = "updated";

    await Promise.resolve();

    assert.equal(oldValue, "initial");
    assert.equal(newValue, "updated");
  });

  it("should trigger binding on every change with alwaysUpdate option", async () => {
    const element = new TestElement();
    let bindingCount = 0;
    let oldValue: unknown;
    let newValue: unknown;

    element.dispatchEvent(
      new JoistValueEvent(new JExpression("alwaysUpdateValue"), (update) => {
        bindingCount++;
        oldValue = update.oldValue;
        newValue = update.newValue;
      }),
    );

    assert.equal(bindingCount, 1);
    assert.equal(oldValue, null);
    assert.equal(newValue, "initial");

    // Change some other value in the model
    element.value = "something else";

    await Promise.resolve();

    assert.equal(bindingCount, 2);
    assert.equal(oldValue, "initial");
    assert.equal(newValue, "initial");
  });
});
