import { assert } from "chai";

import { StaticToken } from "./provider.js";
import { Injector } from "./injector.js";

describe("StaticToken", () => {
  it("should initialize with a name and no factory by default", () => {
    const token = new StaticToken("MY_TOKEN");

    assert.equal(token.name, "MY_TOKEN");
    assert.isUndefined(token.factory);
  });

  it("should initialize with a name and a custom factory function", () => {
    const factory = () => "custom-value";
    const token = new StaticToken("MY_TOKEN", factory);

    assert.equal(token.name, "MY_TOKEN");
    assert.strictEqual(token.factory, factory);
    assert.equal(token.factory?.(new Injector()), "custom-value");
  });

  describe("optional", () => {
    it("should create an optional StaticToken", () => {
      const token = StaticToken.optional<string>("OPT_TOKEN");

      assert.instanceOf(token, StaticToken);
      assert.equal(token.name, "OPT_TOKEN");
    });

    it("should have a default factory that returns null", () => {
      const token = StaticToken.optional<string>("OPT_TOKEN");

      assert.isNull(token.factory?.(new Injector()));
    });
  });
});
