import { expect } from "chai";

import { element } from "./element.js";
import { query } from "./query.js";
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
    fname = query<HTMLInputElement>("#fname");
    lname = query<HTMLInputElement>("#lname");
  }

  const el = new MyElement();

  expect(el.fname()).to.equal(el.shadowRoot?.querySelector("#fname"));
  expect(el.lname()).to.equal(el.shadowRoot?.querySelector("#lname"));
});

it("should patch the selected item", () => {
  @element({
    tagName: "query-test-2",
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
    fname = query<HTMLInputElement>("#fname");
    lname = query<HTMLInputElement>("#lname");
  }

  const el = new MyElement();
  el.fname({ value: "Foo" });
  el.lname({ value: "Bar" });

  expect(
    el.shadowRoot?.querySelector<HTMLInputElement>("#fname")?.value,
  ).to.equal("Foo");

  expect(
    el.shadowRoot?.querySelector<HTMLInputElement>("#lname")?.value,
  ).to.equal("Bar");
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
    fname = query<HTMLInputElement>("#fname");
    lname = query<HTMLInputElement>("#lname");
  }

  const el = new MyElement();
  el.fname();
  el.lname();
  el.fname({ value: "Foo" });
  el.lname({ value: "Bar" });

  expect(
    el.shadowRoot?.querySelector<HTMLInputElement>("#fname")?.value,
  ).to.equal("Foo");

  expect(
    el.shadowRoot?.querySelector<HTMLInputElement>("#lname")?.value,
  ).to.equal("Bar");
});

it("should use function to update", () => {
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
    fname = query<HTMLInputElement>("#fname");
    lname = query<HTMLInputElement>("#lname");
  }

  const el = new MyElement();
  el.fname(() => ({ value: "Foo" }));
  el.lname(() => ({ value: "Bar" }));

  expect(
    el.shadowRoot?.querySelector<HTMLInputElement>("#fname")?.value,
  ).to.equal("Foo");

  expect(
    el.shadowRoot?.querySelector<HTMLInputElement>("#lname")?.value,
  ).to.equal("Bar");
});

it("should use passed in root", () => {
  @element({
    tagName: "query-test-5",
    shadowDom: [],
  })
  class MyElement extends HTMLElement {
    fname = query<HTMLInputElement>("#fname", this);
    lname = query<HTMLInputElement>("#lname", this);
  }

  const el = new MyElement();
  el.innerHTML = /*html*/ `
    <form>
      <input id="fname" name="fname" />
      <input id="lname" name="lname" />
    </form>
  `;

  expect(el.fname()).to.equal(el.querySelector("#fname"));
  expect(el.lname()).to.equal(el.querySelector("#lname"));
});
