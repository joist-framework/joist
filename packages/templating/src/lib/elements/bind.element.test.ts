import "../define.js";

import { fixtureSync, html } from "@open-wc/testing";
import { assert } from "chai";

import type { JoistValueEvent } from "../events.js";

it("should pass props to child", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        if (e.expression.bindTo === "href") {
          e.update({
            oldValue: null,
            newValue: "$foo",
          });
        }

        if (e.expression.bindTo === "target") {
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
      <j-bind attrs="href:href" target="#test"></j-bind>

      <a>Default</a>
      <a id="test">Target</a>
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

it("should write not update if the calculated value is the same as the old value", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: { foo: "bar" }, newValue: { foo: "bar" } });
      }}
    >
      <j-bind props="value:data.foo">
        <input />
      </j-bind>
    </div>
  `);

  const input = element.querySelector("input");

  assert.equal(input?.value, "");
});

it("should wait for depends-on before dispatching events", async () => {
  let eventDispatched = false;

  customElements.define("dependency-1", class extends HTMLElement {});
  customElements.define("dependency-2", class extends HTMLElement {});

  fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        if (e.expression.bindTo === "href") {
          eventDispatched = true;
          e.update({
            oldValue: null,
            newValue: "$foo",
          });
        }
      }}
    >
      <j-bind attrs="href:href" depends-on="dependency-1,dependency-2">
        <a>Hello World</a>
      </j-bind>
    </div>
  `);

  // Initially, no event should be dispatched
  assert.isFalse(eventDispatched);

  // Wait for the custom elements to be defined
  await Promise.all([
    customElements.whenDefined("dependency-1"),
    customElements.whenDefined("dependency-2"),
  ]);

  // Now the event should be dispatched
  assert.isTrue(eventDispatched);
});
