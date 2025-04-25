import "./value.element.js";

import { expect, fixture, html } from "@open-wc/testing";

describe("JoistValueElement", () => {
  it("should update innerHTML when JoistValueEvent callback is invoked", async () => {
    const controller = new AbortController();

    document.body.addEventListener(
      "joist::value",
      (e) => {
        e.cb({ oldValue: null, newValue: "Hello World" });
      },
      { signal: controller.signal },
    );

    const element = await fixture(html`<j-value bind="testBind"></j-value>`);

    expect(element.innerHTML).to.equal("Hello World");

    controller.abort();
  });
});
