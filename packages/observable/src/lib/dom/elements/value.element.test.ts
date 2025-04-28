import "./value.element.js";

import { fixtureSync, html } from "@open-wc/testing";
import { assert } from "chai";

import type { JoistValueEvent } from "../events.js";

it("should render content when the bind value is truthy", () => {
  const element = fixtureSync(html`
    <div @joist::value=${(e: JoistValueEvent) => {
      e.cb({ oldValue: null, newValue: "Hello World" });
    }}>
      <j-value bind="test"></j-value>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "Hello World");
});
