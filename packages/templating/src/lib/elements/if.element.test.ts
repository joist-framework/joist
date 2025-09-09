import "../define.js";

import { fixtureSync, html } from "@open-wc/testing";
import { assert } from "chai";

import type { JoistValueEvent } from "../events.js";

it("should render content when the bind value is truthy", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: true });
      }}
    >
      <j-if bind="test">
        <template>Visible Content</template>
      </j-if>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "Visible Content");
});

it("should not render content when the bind value is falsy", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: true });
        e.update({ oldValue: null, newValue: false });
      }}
    >
      <j-if bind="test">
        <template>Visible Content</template>
      </j-if>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "");
});

it("should handle negated tokens correctly", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: false });
      }}
    >
      <j-if bind="!test">
        <template>Visible Content</template>
      </j-if>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "Visible Content");
});

it("should render else template when condition is falsy", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: false });
      }}
    >
      <j-if bind="test">
        <template>If Content</template>
        <template else>Else Content</template>
      </j-if>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "Else Content");
});

it("should switch between if and else templates", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: false });
        e.update({ oldValue: false, newValue: true });
      }}
    >
      <j-if bind="test">
        <template>If Content</template>
        <template else>Else Content</template>
      </j-if>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "If Content");
});

it("should handle equality comparison", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: { status: "active" } });
      }}
    >
      <j-if bind="example.status == active">
        <template>Status is Active</template>
      </j-if>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "Status is Active");
});

it("should handle greater than comparison", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: { count: 10 } });
      }}
    >
      <j-if bind="example.count > 5">
        <template>Count is Greater Than 5</template>
      </j-if>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "Count is Greater Than 5");
});

it("should handle less than comparison", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: { score: 75 } });
      }}
    >
      <j-if bind="example.score < 100">
        <template>Score is Less Than 100</template>
      </j-if>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "Score is Less Than 100");
});

it("should handle nested path comparisons", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: { user: { score: 150 } } });
      }}
    >
      <j-if bind="example.user.score > 100">
        <template>User Score is Above 100</template>
      </j-if>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "User Score is Above 100");
});

it("should handle negated comparisons", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: { status: "inactive" } });
      }}
    >
      <j-if bind="!example.status == active">
        <template>Status is Not Active</template>
      </j-if>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "Status is Not Active");
});

it("should handle string number comparisons", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: { count: "10" } });
      }}
    >
      <j-if bind="example.count > 5">
        <template>String Count is Greater Than 5</template>
      </j-if>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "String Count is Greater Than 5");
});

it("should handle undefined values in comparisons", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: { count: undefined } });
      }}
    >
      <j-if bind="example.count > 5">
        <template>Count is Greater Than 5</template>
      </j-if>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "");
});

it("should handle not equal comparison", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: { status: "inactive" } });
      }}
    >
      <j-if bind="example.status != active">
        <template>Status is Not Active</template>
      </j-if>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "Status is Not Active");
});

it("should handle not equal comparison with matching value", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: { status: "active" } });
      }}
    >
      <j-if bind="example.status != active">
        <template>Status is Not Active</template>
      </j-if>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "");
});

it("should handle not equal comparison with string numbers", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: { count: "10" } });
      }}
    >
      <j-if bind="example.count != 5">
        <template>Count is Not 5</template>
      </j-if>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "Count is Not 5");
});

it("should handle not equal comparison with undefined", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: { status: undefined } });
      }}
    >
      <j-if bind="example.status != active">
        <template>Status is Not Active</template>
      </j-if>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "Status is Not Active");
});

it("should handle array length", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: [0, 1, 2] });
      }}
    >
      <j-if bind="example.length">
        <template>Array has length</template>
        <template else>Array has no length</template>
      </j-if>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "Array has length");
});

it("should handle a first change even if the value is the same", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: null, firstChange: true });
      }}
    >
      <j-if bind="example.length">
        <template>Array has length</template>
        <template else>Array has no length</template>
      </j-if>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "Array has no length");
});

it("should render in target container", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: true });
      }}
    >
      <j-if bind="test" target="#container">
        <template>Visible Content</template>
      </j-if>

      <div id="container"></div>
    </div>
  `);

  const container = element.querySelector("#container");

  assert.equal(container?.textContent?.trim(), "Visible Content");
});

it("should wait for depends-on before dispatching events", async () => {
  let eventDispatched = false;

  customElements.define("dependency-1", class extends HTMLElement {});
  customElements.define("dependency-2", class extends HTMLElement {});

  fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        if (e.expression.bindTo === "test") {
          eventDispatched = true;
          e.update({ oldValue: null, newValue: true });
        }
      }}
    >
      <j-if bind="test" depends-on="dependency-1,dependency-2">
        <template>Visible Content</template>
      </j-if>
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
