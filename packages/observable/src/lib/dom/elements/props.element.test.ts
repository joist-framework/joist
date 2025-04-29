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
          newValue: "$foo",
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
      <j-props $href:href $target.value:target>
        <a>Hello World</a>
      </j-props>
    </div>
  `);

  const anchor = element.querySelector("a");

  assert.equal(anchor?.getAttribute("href"), "$foo");
  assert.equal(anchor?.getAttribute("target"), "_blank");
});

it("should pass props to specified child", () => {
  const element = fixtureSync(html`
    <div @joist::value=${(e: JoistValueEvent) => {
      e.cb({
        oldValue: null,
        newValue: "$foo",
      });
    }}>
      <j-props target="#test" $href:href>
        <a>Default</a>
        <a id="test">Target</a>
      </j-props>
    </div>
  `);

  const anchor = element.querySelectorAll("a");

  assert.equal(anchor[0].getAttribute("href"), null);
  assert.equal(anchor[1].getAttribute("href"), "$foo");
});
