import { assert } from "chai";
import { element } from "./element.js";
import { ready } from "./lifecycle.js";

it("should call all callbacks when template is ready", () => {
  @element({
    tagName: "template-ready-1",
  })
  class MyElement extends HTMLElement {
    callCount: Record<string, number> = {};

    @ready()
    onTemplateReady1() {
      this.callCount.onTemplateReady1 ??= 0;
      this.callCount.onTemplateReady1++;
    }

    @ready()
    onTemplateReady2() {
      this.callCount.onTemplateReady2 ??= 0;
      this.callCount.onTemplateReady2++;
    }
  }

  const el = new MyElement();

  assert.deepEqual(el.callCount, {
    onTemplateReady1: 1,
    onTemplateReady2: 1,
  });
});
