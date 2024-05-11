import { element } from "./element.js";
import { tagName } from "./tag-name.js";

describe("tag-name", () => {
  it("should define a custom element", async () => {
    @element
    class MyElement extends HTMLElement {
      @tagName static tagName = "tn-test-1";
    }

    return customElements.whenDefined(MyElement.tagName);
  });
});
