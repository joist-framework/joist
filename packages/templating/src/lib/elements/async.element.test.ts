import "./async.element.js";

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
