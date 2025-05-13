import { expect } from "@open-wc/testing";
import { observe } from "./observe.js";

describe("computed decorator", () => {
  it("should compute values based on other properties", async () => {
    class TestClass {
      @observe()
      accessor firstName = "John";

      @observe()
      accessor lastName = "Doe";

      @observe((i) => `${i.firstName} ${i.lastName}`)
      accessor fullName = "";
    }

    const instance = new TestClass();
    expect(instance.fullName).to.equal("John Doe");

    // Update dependencies
    instance.firstName = "Jane";

    await Promise.resolve();

    expect(instance.fullName).to.equal("Jane Doe");
  });

  it("should handle multiple computed properties", async () => {
    class TestClass {
      @observe()
      accessor x = 2;

      @observe()
      accessor y = 3;

      @observe((i) => i.x + i.y)
      accessor sum = 0;

      @observe((i) => i.x * i.y)
      accessor product = 0;
    }

    const instance = new TestClass();
    expect(instance.sum).to.equal(5);
    expect(instance.product).to.equal(6);

    // Update dependencies
    instance.x = 4;

    await Promise.resolve();

    expect(instance.sum).to.equal(7);
    expect(instance.product).to.equal(12);
  });
});
