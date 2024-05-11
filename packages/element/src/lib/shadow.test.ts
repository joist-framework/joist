import { expect } from "@open-wc/testing";

import { css, html } from "./tags.js";
import { shadow } from "./shadow.js";

describe("template", () => {
  it("should apply a stylesheet", () => {
    class MyElement extends HTMLElement {
      @shadow styles = css`
        :host {
          display: flex;
        }
      `;
    }

    customElements.define("template-1", MyElement);

    const el = new MyElement();

    expect(el.shadowRoot!.adoptedStyleSheets.length).to.eq(1);
  });

  it("should apply html", () => {
    class MyElement extends HTMLElement {
      @shadow styles = css`
        :host {
          display: flex;
        }
      `;

      @shadow template = html`<slot></slot>`;
    }

    customElements.define("template-2", MyElement);

    const el = new MyElement();

    expect(el.shadowRoot?.innerHTML).to.eq("<slot></slot>");
  });
});
