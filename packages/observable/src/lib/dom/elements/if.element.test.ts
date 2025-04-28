import "./if.element.js";

import { assert, fixture, html } from "@open-wc/testing";

import type { JoistValueEvent } from "../value.events.js";

describe("JoistIfElement", () => {
  it("should render content when the bind value is truthy", async () => {
    const element = await fixture(html`
        <div @joist::value=${(e: JoistValueEvent) => {
          e.stopPropagation();
          e.cb({ oldValue: null, newValue: true });
        }}>
            <j-if bind="test">
                <template>Visible Content</template>
            </j-if>
        </div>
    `);

    assert.equal(element.textContent?.trim(), "Visible Content");
  });

  it("should not render content when the bind value is falsy", async () => {
    const element = await fixture(html`
        <div @joist::value=${(e: JoistValueEvent) => {
          e.stopPropagation();
          e.cb({ oldValue: null, newValue: false });
        }}>
            <j-if bind="test">
                <template>Visible Content</template>
            </j-if>
        </div>
    `);

    assert.equal(element.textContent?.trim(), "");
  });

  it("should handle negated tokens correctly", async () => {
    const element = await fixture(html`
      <div @joist::value=${(e: JoistValueEvent) => {
        e.stopPropagation();
        e.cb({ oldValue: null, newValue: false });
      }}>
          <j-if bind="!test">
              <template>Visible Content</template>
          </j-if>
      </div>
  `);

    assert.equal(element.textContent?.trim(), "Visible Content");
  });
});
