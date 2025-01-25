import { expect } from "chai";

import { element } from "./element.js";
import { queryAll } from "./query-all.js";
import { html } from "./tags.js";

it("should work", () => {
  @element({
    tagName: "query-test-1",
    shadowDom: [
      html`
        <form>
          <input id="fname" name="fname" />
          <input id="lname" name="lname" />
        </form>
      `,
    ],
  })
  class MyElement extends HTMLElement {
    inputs = queryAll("input");
  }

  const el = new MyElement();

  expect(el.inputs()[0]).to.equal(el.shadowRoot?.querySelector("#fname"));
  expect(el.inputs()[1]).to.equal(el.shadowRoot?.querySelector("#lname"));
});

it("should patch items when patch is returned", () => {
  @element({
    tagName: "query-test-2",
    shadowDom: [
      html`
        <form>
          <input id="fname" name="fname" value="Danny" />
          <input id="lname" name="lname" value="Blue" />
        </form>
      `,
    ],
  })
  class MyElement extends HTMLElement {
    inputs = queryAll("input");
  }

  const el = new MyElement();

  el.inputs((node) => {
    if (node.id === "fname") {
      return {
        value: "Foo",
      };
    }

    return null;
  });

  expect(
    el.shadowRoot?.querySelector<HTMLInputElement>("#fname")?.value,
  ).to.equal("Foo");

  expect(
    el.shadowRoot?.querySelector<HTMLInputElement>("#lname")?.value,
  ).to.equal("Blue");
});

it("should patch the selected item when cached", () => {
  @element({
    tagName: "query-test-3",
    shadowDom: [
      html`
        <form>
          <input id="fname" name="fname" />
          <input id="lname" name="lname" />
        </form>
      `,
    ],
  })
  class MyElement extends HTMLElement {
    inputs = queryAll("input");
  }

  const el = new MyElement();
  el.inputs();

  el.inputs((node) => {
    if (node.id === "fname") {
      return {
        value: "Foo",
      };
    }

    return {
      value: "Bar",
    };
  });

  expect(
    el.shadowRoot?.querySelector<HTMLInputElement>("#fname")?.value,
  ).to.equal("Foo");

  expect(
    el.shadowRoot?.querySelector<HTMLInputElement>("#lname")?.value,
  ).to.equal("Bar");
});

it("should apply the same patch to all elements", () => {
  @element({
    tagName: "query-test-4",
    shadowDom: [
      html`
        <form>
          <input id="fname" name="fname" />
          <input id="lname" name="lname" />
        </form>
      `,
    ],
  })
  class MyElement extends HTMLElement {
    inputs = queryAll("input");
  }

  const el = new MyElement();
  el.inputs({ value: "TEST" });

  expect(
    el.shadowRoot?.querySelector<HTMLInputElement>("#fname")?.value,
  ).to.equal("TEST");

  expect(
    el.shadowRoot?.querySelector<HTMLInputElement>("#lname")?.value,
  ).to.equal("TEST");
});

it("should use passed in root", () => {
  @element({
    tagName: "query-test-5",
    shadowDom: [],
  })
  class MyElement extends HTMLElement {
    inputs = queryAll("input", this);
  }

  const el = new MyElement();
  el.innerHTML = /*html*/ `
    <form>
      <input id="fname" name="fname" />
      <input id="lname" name="lname" />
    </form>
  `;

  expect(el.inputs()[0]).to.equal(el.querySelector("#fname"));
  expect(el.inputs()[1]).to.equal(el.querySelector("#lname"));
});
