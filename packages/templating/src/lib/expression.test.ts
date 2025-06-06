import { assert } from "chai";

import { JExpression } from "./expression.js";

describe("JExpression", () => {
  describe("constructor", () => {
    it("should initialize with a raw token", () => {
      const token = new JExpression("example.token");
      assert.equal(token.rawToken, "example.token");
    });

    it("should set isNegated to true if the token starts with '!'", () => {
      const token = new JExpression("!example.token");
      assert.isTrue(token.isNegated);
    });

    it("should set isNegated to false if the token does not start with '!'", () => {
      const token = new JExpression("example.token");
      assert.isFalse(token.isNegated);
    });

    it("should correctly parse the bindTo property", () => {
      const token = new JExpression("example.token");
      assert.equal(token.bindTo, "example");
    });

    it("should correctly parse the path property", () => {
      const token = new JExpression("example.token.part");
      assert.deepEqual(token.path, ["token", "part"]);
    });

    it("should remove '!' from bindTo if present", () => {
      const token = new JExpression("!example.token");
      assert.equal(token.bindTo, "example");
    });

    it("should parse equals operator value", () => {
      const token = new JExpression("example==value");
      assert.equal(token.equalsValue, "value");
    });

    it("should handle equals operator with negation", () => {
      const token = new JExpression("!example == value");
      assert.equal(token.equalsValue, "value");
      assert.isTrue(token.isNegated);
    });

    it("should handle equals operator with nested paths", () => {
      const token = new JExpression("example.nested == value");
      assert.equal(token.equalsValue, "value");
      assert.deepEqual(token.path, ["nested"]);
    });

    it("should parse greater than operator value", () => {
      const token = new JExpression("example > 5");
      assert.equal(token.gtValue, "5");
    });

    it("should parse less than operator value", () => {
      const token = new JExpression("example < 10");
      assert.equal(token.ltValue, "10");
    });

    it("should handle greater than operator with negation", () => {
      const token = new JExpression("!example > 5");
      assert.equal(token.gtValue, "5");
      assert.isTrue(token.isNegated);
    });

    it("should handle less than operator with nested paths", () => {
      const token = new JExpression("example.count < 10");
      assert.equal(token.ltValue, "10");
      assert.deepEqual(token.path, ["count"]);
    });
  });

  describe("readTokenValueFrom", () => {
    it("should read the value from a nested object", () => {
      const token = new JExpression("example.token.part");
      const obj = { token: { part: 42 } };
      const value = token.evaluate<number>(obj);
      assert.equal(value, 42);
    });

    it("should return undefined if the path does not exist", () => {
      const token = new JExpression("example.nonexistent.path");
      const obj = { token: { part: 42 } };
      const value = token.evaluate(obj);
      assert.isUndefined(value);
    });

    it("should handle empty paths gracefully", () => {
      const token = new JExpression("example");
      const obj = { foo: 42 };
      const value = token.evaluate(obj);

      assert.deepEqual(value, { foo: 42 });
    });

    it("should parse values from strings", () => {
      const token = new JExpression("example.length");
      const value = token.evaluate("42");

      assert.equal(value, 2);
    });

    it("should return true when equals against primative", () => {
      const token = new JExpression("example == active");
      const value = token.evaluate<boolean>("active");
      assert.isTrue(value);
    });

    it("should return true when equals comparison matches", () => {
      const token = new JExpression("example.status==active");
      const obj = { status: "active" };
      const value = token.evaluate<boolean>(obj);
      assert.isTrue(value);
    });

    it("should return false when equals comparison does not match", () => {
      const token = new JExpression("example.status==active");
      const obj = { status: "inactive" };
      const value = token.evaluate<boolean>(obj);
      assert.isFalse(value);
    });

    it("should handle equals comparison with numbers", () => {
      const token = new JExpression("example.count == 5");
      const obj = { count: 5 };
      const value = token.evaluate<boolean>(obj);
      assert.isTrue(value);
    });

    it("should handle equals comparison with nested paths", () => {
      const token = new JExpression("example.user.status == active");
      const obj = { user: { status: "active" } };
      const value = token.evaluate<boolean>(obj);
      assert.isTrue(value);
    });

    it("should handle equals comparison with undefined values", () => {
      const token = new JExpression("example.status == active");
      const obj = { status: undefined };
      const value = token.evaluate<boolean>(obj);
      assert.isFalse(value);
    });

    it("should return true when greater than comparison matches", () => {
      const token = new JExpression("example.count > 5");
      const obj = { count: 10 };
      const value = token.evaluate<boolean>(obj);
      assert.isTrue(value);
    });

    it("should return false when greater than comparison does not match", () => {
      const token = new JExpression("example.count > 5");
      const obj = { count: 3 };
      const value = token.evaluate<boolean>(obj);
      assert.isFalse(value);
    });

    it("should return true when less than comparison matches", () => {
      const token = new JExpression("example.count < 10");
      const obj = { count: 5 };
      const value = token.evaluate<boolean>(obj);
      assert.isTrue(value);
    });

    it("should return false when less than comparison does not match", () => {
      const token = new JExpression("example.count < 10");
      const obj = { count: 15 };
      const value = token.evaluate<boolean>(obj);
      assert.isFalse(value);
    });

    it("should handle greater than comparison with string numbers", () => {
      const token = new JExpression("example.count > 5");
      const obj = { count: "10" };
      const value = token.evaluate<boolean>(obj);
      assert.isTrue(value);
    });

    it("should handle less than comparison with string numbers", () => {
      const token = new JExpression("example.count < 10");
      const obj = { count: "5" };
      const value = token.evaluate<boolean>(obj);
      assert.isTrue(value);
    });

    it("should handle greater than comparison with undefined values", () => {
      const token = new JExpression("example.count > 5");
      const obj = { count: undefined };
      const value = token.evaluate<boolean>(obj);
      assert.isFalse(value);
    });

    it("should handle less than comparison with undefined values", () => {
      const token = new JExpression("example.count < 10");
      const obj = { count: undefined };
      const value = token.evaluate<boolean>(obj);
      assert.isFalse(value);
    });
  });
});
