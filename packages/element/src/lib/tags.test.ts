import { assert } from "chai";
import { CSSResult, HTMLResult, css, html } from "./tags.js";

describe("tags", () => {
  describe("html", () => {
    it("should create an HTMLResult instance", () => {
      const result = html`<div>Hello</div>`;
      assert.instanceOf(result, HTMLResult);
    });

    it("should create a cloneable node", () => {
      const result = html`<div>Hello</div>`;
      const node = result.createNode();
      assert.instanceOf(node, Node);
      assert.equal(node.textContent, "Hello");
    });

    it("should apply HTML to shadow root", () => {
      const div = document.createElement("div");
      const shadow = div.attachShadow({ mode: "open" });

      const result = html`<div>Hello</div>`;
      result.apply(div);

      assert.equal(shadow.innerHTML, "<div>Hello</div>");
    });

    it("should not apply HTML if no shadow root", () => {
      const element = document.createElement("div");
      const result = html`<div>Hello</div>`;
      result.apply(element);

      assert.equal(element.innerHTML, "");
    });
  });

  describe("css", () => {
    it("should create a CSSResult instance", () => {
      const result = css`div { color: red; }`;
      assert.instanceOf(result, CSSResult);
    });

    it("should create a stylesheet with correct content", () => {
      const result = css`div { color: red; }`;

      const element = document.createElement("div");
      const shadow = element.attachShadow({ mode: "open" });
      result.apply(element);

      assert.equal(shadow.adoptedStyleSheets.length, 1);
      assert.equal(
        shadow.adoptedStyleSheets[0].cssRules[0].cssText,
        "div { color: red; }",
      );
    });

    it("should apply CSS to shadow root", () => {
      const element = document.createElement("div");
      const shadow = element.attachShadow({ mode: "open" });
      const result = css`div { color: red; }`;
      result.apply(element);

      assert.equal(shadow.adoptedStyleSheets.length, 1);
      assert.equal(
        shadow.adoptedStyleSheets[0].cssRules[0].cssText,
        "div { color: red; }",
      );
    });

    it("should not apply CSS if no shadow root", () => {
      const element = document.createElement("div");
      const result = css`div { color: red; }`;
      result.apply(element);

      assert.equal(element.shadowRoot, null);
    });

    it("should append to existing style sheets", () => {
      const element = document.createElement("div");
      const shadow = element.attachShadow({ mode: "open" });

      const sheet1 = css`div { color: red; }`;
      const sheet2 = css`span { color: blue; }`;

      sheet1.apply(element);
      sheet2.apply(element);

      assert.equal(shadow.adoptedStyleSheets.length, 2);
      assert.equal(
        shadow.adoptedStyleSheets[0].cssRules[0].cssText,
        "div { color: red; }",
      );
      assert.equal(
        shadow.adoptedStyleSheets[1].cssRules[0].cssText,
        "span { color: blue; }",
      );
    });
  });
});
