import "./if.element.js";

import { fixtureSync, html } from "@open-wc/testing";
import { assert } from "chai";

import type { JoistValueEvent } from "../events.js";

it("should render content when the bind value is truthy", () => {
  const element = fixtureSync(html`
    <div @joist::value=${(e: JoistValueEvent) => {
      e.cb({ oldValue: null, newValue: true });
    }}>
      <j-if bind="test">
        <template>Visible Content</template>
      </j-if>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "Visible Content");
});

it("should not render content when the bind value is falsy", () => {
  const element = fixtureSync(html`
    <div @joist::value=${(e: JoistValueEvent) => {
      e.cb({ oldValue: null, newValue: false });
    }}>
      <j-if bind="test">
        <template>Visible Content</template>
      </j-if>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "");
});

it("should handle negated tokens correctly", () => {
  const element = fixtureSync(html`
    <div @joist::value=${(e: JoistValueEvent) => {
      e.cb({ oldValue: null, newValue: false });
    }}>
      <j-if bind="!test">
        <template>Visible Content</template>
      </j-if>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "Visible Content");
});
