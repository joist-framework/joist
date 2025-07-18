import "../define.js";

import { fixtureSync, html } from "@open-wc/testing";
import { assert } from "chai";

import type { JoistValueEvent } from "../events.js";

it("should render content when the bind value is truthy", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: "Hello World" });
      }}
    >
      <j-val bind="test"></j-val>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "Hello World");
});

it("should not write null values to textContent", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: "Hello", newValue: null });
      }}
    >
      <j-val bind="test">Hello World</j-val>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "Hello World");
});

it("should not write undefined values to textContent", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: "Hello", newValue: undefined });
      }}
    >
      <j-val bind="test">Hello World</j-val>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "Hello World");
});

it("should wait for depends-on before dispatching events", async () => {
  let eventDispatched = false;

  customElements.define("dependency-1", class extends HTMLElement {});
  customElements.define("dependency-2", class extends HTMLElement {});

  fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        if (e.expression.bindTo === "test") {
          eventDispatched = true;
          e.update({ oldValue: null, newValue: "Hello World" });
        }
      }}
    >
      <j-val bind="test" depends-on="dependency-1,dependency-2"></j-val>
    </div>
  `);

  // Initially, no event should be dispatched
  assert.isFalse(eventDispatched);

  // Wait for the custom elements to be defined
  await Promise.all([
    customElements.whenDefined("dependency-1"),
    customElements.whenDefined("dependency-2"),
  ]);

  // Now the event should be dispatched
  assert.isTrue(eventDispatched);
});
