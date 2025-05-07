import { assert } from "chai";

import { JToken } from "./token.js";

describe("JToken", () => {
  describe("constructor", () => {
    it("should initialize with a raw token", () => {
      const token = new JToken("example.token");
      assert.equal(token.rawToken, "example.token");
    });

    it("should set isNegated to true if the token starts with '!'", () => {
      const token = new JToken("!example.token");
      assert.isTrue(token.isNegated);
    });

    it("should set isNegated to false if the token does not start with '!'", () => {
      const token = new JToken("example.token");
      assert.isFalse(token.isNegated);
    });

    it("should correctly parse the bindTo property", () => {
      const token = new JToken("example.token");
      assert.equal(token.bindTo, "example");
    });

    it("should correctly parse the path property", () => {
      const token = new JToken("example.token.part");
      assert.deepEqual(token.path, ["token", "part"]);
    });

    it("should remove '!' from bindTo if present", () => {
      const token = new JToken("!example.token");
      assert.equal(token.bindTo, "example");
    });
  });

  describe("readTokenValueFrom", () => {
    it("should read the value from a nested object", () => {
      const token = new JToken("example.token.part");
      const obj = { token: { part: 42 } };
      const value = token.readTokenValueFrom<number>(obj);
      assert.equal(value, 42);
    });

    it("should return undefined if the path does not exist", () => {
      const token = new JToken("example.nonexistent.path");
      const obj = { token: { part: 42 } };
      const value = token.readTokenValueFrom(obj);
      assert.isUndefined(value);
    });

    it("should handle empty paths gracefully", () => {
      const token = new JToken("example");
      const obj = { foo: 42 };
      const value = token.readTokenValueFrom(obj);

      assert.deepEqual(value, { foo: 42 });
    });

    it("should throw an error if the object is null or undefined", () => {
      const token = new JToken("example.token");
      assert.throws(
        () => token.readTokenValueFrom<any>(null as any),
        TypeError,
      );

      assert.throws(
        () => token.readTokenValueFrom<any>(undefined as any),
        TypeError,
      );
    });
  });
});
