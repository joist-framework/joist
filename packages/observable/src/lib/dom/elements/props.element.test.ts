import "./props.element.js";

import { fixtureSync, html } from "@open-wc/testing";
import { assert } from "chai";

import type { JoistValueEvent } from "../events.js";

it("should pass props to child", () => {
  const element = fixtureSync(html`
    <div @joist::value=${(e: JoistValueEvent) => {
      if (e.token.bindTo === "href") {
        e.cb({
          oldValue: null,
          newValue: "#foo",
        });
      }

      if (e.token.bindTo === "target") {
        e.cb({
          oldValue: null,
          newValue: {
            value: "_blank",
          },
        });
      }
    }}>
      <j-props #href:href #target.value:target>
        <a>Hello World</a>
      </j-props>
    </div>
  `);

  const anchor = element.querySelector("a");

  assert.equal(anchor?.getAttribute("href"), "#foo");
  assert.equal(anchor?.getAttribute("target"), "_blank");
});
