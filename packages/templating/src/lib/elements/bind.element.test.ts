import "./bind.element.js";

import { fixtureSync, html } from "@open-wc/testing";
import { assert } from "chai";

import type { JoistValueEvent } from "../events.js";

it("should pass props to child", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        if (e.token.bindTo === "href") {
          e.update({
            oldValue: null,
            newValue: "$foo",
          });
        }

        if (e.token.bindTo === "target") {
          e.update({
            oldValue: null,
            newValue: {
              value: "_blank",
            },
          });
        }
      }}
    >
      <j-bind attrs="href:href" props="target:target.value">
        <a>Hello World</a>
      </j-bind>
    </div>
  `);

  const anchor = element.querySelector("a");

  assert.equal(anchor?.getAttribute("href"), "$foo");
  assert.equal(anchor?.getAttribute("target"), "_blank");
});

it("should pass props to specified child", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({
          oldValue: null,
          newValue: "#foo",
        });
      }}
    >
      <j-bind attrs="href:href" target="#test">
        <a>Default</a>
        <a id="test">Target</a>
      </j-bind>
    </div>
  `);

  const anchor = element.querySelectorAll("a");

  assert.equal(anchor[0].getAttribute("href"), null);
  assert.equal(anchor[1].getAttribute("href"), "#foo");
});

it("should be case sensitive", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: 8 });
      }}
    >
      <j-bind
        props="
          selectionStart:foo,
          selectionEnd:foo
        "
      >
        <input value="1234567890" />
      </j-bind>
    </div>
  `);

  const input = element.querySelector("input");

  assert.equal(input?.selectionStart, 8);
  assert.equal(input?.selectionEnd, 8);
});

it("should default to the mapTo value if bindTo is not provided", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: 8 });
      }}
    >
      <j-bind props="selectionStart, selectionEnd">
        <input value="1234567890" />
      </j-bind>
    </div>
  `);

  const input = element.querySelector("input");

  assert.equal(input?.selectionStart, 8);
  assert.equal(input?.selectionEnd, 8);
});
