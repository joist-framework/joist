import "./value.element.js";

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
