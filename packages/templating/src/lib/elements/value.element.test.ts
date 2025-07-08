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
