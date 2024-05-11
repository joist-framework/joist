import { expect } from "@open-wc/testing";

import { observe } from "./observe.js";
import { watch } from "./watch.js";

describe("observable: observe()", () => {
  it("should watch externally from the class", (done) => {
    class Counter {
      @observe static accessor value = 0;
    }

    watch(Counter, () => {
      expect(Counter.value).to.equal(1);

      done();
    });

    expect(Counter.value).to.equal(0);

    Counter.value++;

    expect(Counter.value).to.equal(1);
  });
});
