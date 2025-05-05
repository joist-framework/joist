import "./for.element.js";
import "./value.element.js";

import { fixtureSync, html } from "@open-wc/testing";
import { assert } from "chai";

import type { JoistValueEvent } from "../events.js";

it("should iterate over an iterable", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({
          oldValue: null,
          newValue: new Set([
            { id: "123", label: "Hello" },
            { id: "456", label: "World" },
          ]),
        });
      }}
    >
      <ul>
        <j-for bind="items" key="id">
          <template>
            <li>
              <j-value bind="each.value.label"></j-value>
            </li>
          </template>
        </j-for>
      </ul>
    </div>
  `);

  const listItems = element.querySelectorAll("li");

  assert.equal(listItems.length, 2);
  assert.equal(listItems[0].textContent?.trim(), "Hello");
  assert.equal(listItems[1].textContent?.trim(), "World");
  assert.isAccessible(element);
});
