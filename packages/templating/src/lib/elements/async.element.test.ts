import "../define.js";

import { fixtureSync, html } from "@open-wc/testing";
import { assert } from "chai";

import type { JoistValueEvent } from "../events.js";

it("should show loading template when promise is pending", async () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: new Promise(() => {}) });
      }}
    >
      <j-async bind="test">
        <template loading>Loading...</template>
        <template success>Success!</template>
        <template error>Error!</template>
      </j-async>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "Loading...");
});

it("should show success template when promise resolves", async () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: Promise.resolve("data") });
      }}
    >
      <j-async bind="test">
        <template loading>Loading...</template>
        <template success>Success!</template>
        <template error>Error!</template>
      </j-async>
    </div>
  `);

  // Wait for promise to resolve
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(element.textContent?.trim(), "Success!");
});

it("should show error template when promise rejects", async () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: Promise.reject("error") });
      }}
    >
      <j-async bind="test">
        <template loading>Loading...</template>
        <template success>Success!</template>
        <template error>Error!</template>
      </j-async>
    </div>
  `);

  // Wait for promise to reject
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(element.textContent?.trim(), "Error!");
});

it("should handle state transitions", async () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        const promise = new Promise((resolve) => {
          setTimeout(() => resolve("data"), 100);
        });
        e.update({ oldValue: null, newValue: promise });
      }}
    >
      <j-async bind="test">
        <template loading>Loading...</template>
        <template success>Success!</template>
        <template error>Error!</template>
      </j-async>
    </div>
  `);

  // Initially should show loading
  assert.equal(element.textContent?.trim(), "Loading...");

  // Wait for promise to resolve
  await new Promise((resolve) => setTimeout(resolve, 150));
  assert.equal(element.textContent?.trim(), "Success!");
});

it("should show loading template when AsyncState is loading", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: { status: "loading" } });
      }}
    >
      <j-async bind="test">
        <template loading>Loading...</template>
        <template success>Success!</template>
        <template error>Error!</template>
      </j-async>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "Loading...");
});

it("should show success template when AsyncState is success", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: { status: "success", data: "test data" } });
      }}
    >
      <j-async bind="test">
        <template loading>Loading...</template>
        <template success>Success!</template>
        <template error>Error!</template>
      </j-async>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "Success!");
});

it("should show error template when AsyncState is error", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        e.update({ oldValue: null, newValue: { status: "error", error: "test error" } });
      }}
    >
      <j-async bind="test">
        <template loading>Loading...</template>
        <template success>Success!</template>
        <template error>Error!</template>
      </j-async>
    </div>
  `);

  assert.equal(element.textContent?.trim(), "Error!");
});

it("should handle AsyncState transitions", () => {
  const element = fixtureSync(html`
    <div
      @joist::value=${(e: JoistValueEvent) => {
        // Initial state
        e.update({ oldValue: null, newValue: { status: "loading" } });

        // Simulate state transition after a short delay
        setTimeout(() => {
          e.update({
            oldValue: { status: "loading" },
            newValue: { status: "success", data: "test data" },
          });
        }, 100);
      }}
    >
      <j-async bind="test">
        <template loading>Loading...</template>
        <template success>Success!</template>
        <template error>Error!</template>
      </j-async>
    </div>
  `);

  // Initially should show loading
  assert.equal(element.textContent?.trim(), "Loading...");

  // Wait for state transition
  return new Promise((resolve) => {
    setTimeout(() => {
      assert.equal(element.textContent?.trim(), "Success!");
      resolve(undefined);
    }, 150);
  });
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
          e.update({ oldValue: null, newValue: Promise.resolve("data") });
        }
      }}
    >
      <j-async bind="test" depends-on="dependency-1,dependency-2">
        <template loading>Loading...</template>
        <template success>Success!</template>
        <template error>Error!</template>
      </j-async>
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
