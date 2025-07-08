import "../define.js";

import { fixtureSync, html } from "@open-wc/testing";
import { assert } from "chai";
import { JoistScopeElement } from "./scope.element.js";

describe("j-scope", () => {
  it("should render its children", () => {
    const element = fixtureSync<JoistScopeElement>(html`
      <j-scope>
        <div>Test Content</div>
      </j-scope>
    `);

    assert.equal(element.textContent?.trim(), "Test Content");
  });

  it("should set and get scope property", async () => {
    const element = fixtureSync<JoistScopeElement>(html`
      <j-scope>
        <j-val bind="scope.foo"></j-val>
      </j-scope>
    `);

    element.scope = { foo: "bar" };

    await Promise.resolve();

    assert.equal(element.textContent?.trim(), "bar");
  });
});
