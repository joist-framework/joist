import { assert } from "chai";

import { isCreationContext } from "./metadata.js";
import { SENTINAL } from "./symbols.js";
import { Injector } from "./injector.js";

describe("metadata helpers", () => {
  describe("isCreationContext", () => {
    it("should return true for a valid creation context", () => {
      const injector = new Injector();
      const validContext = {
        sentinel: SENTINAL,
        injector,
      };

      assert.isTrue(isCreationContext(validContext));
    });

    it("should return false for null and undefined", () => {
      assert.isFalse(isCreationContext(null));
      assert.isFalse(isCreationContext(undefined));
    });

    it("should return false for primitives", () => {
      assert.isFalse(isCreationContext("hello"));
      assert.isFalse(isCreationContext(42));
      assert.isFalse(isCreationContext(true));
      assert.isFalse(isCreationContext(Symbol("test")));
    });

    it("should return false for an object missing sentinel", () => {
      const injector = new Injector();
      const invalidContext = {
        injector,
      };

      assert.isFalse(isCreationContext(invalidContext));
    });

    it("should return false for an object with incorrect sentinel value", () => {
      const injector = new Injector();
      const invalidContext = {
        sentinel: Symbol("SENTINAL"), // different symbol
        injector,
      };

      assert.isFalse(isCreationContext(invalidContext));
    });

    it("should return false for an empty object", () => {
      assert.isFalse(isCreationContext({}));
    });
  });
});
