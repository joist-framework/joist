import { assert } from "chai";

import { ProviderStore } from "./provider-store.js";
import { StaticToken, type Provider } from "./provider.js";

describe("ProviderStore", () => {
  it("should initialize empty", () => {
    const store = new ProviderStore();
    const token = new StaticToken<string>("test");

    assert.deepEqual(store.get(token), []);
  });

  it("should initialize with null or undefined", () => {
    const storeNull = new ProviderStore(null);
    const storeUndefined = new ProviderStore(undefined);
    const token = new StaticToken<string>("test");

    assert.deepEqual(storeNull.get(token), []);
    assert.deepEqual(storeUndefined.get(token), []);
  });

  it("should initialize with an iterable of entries using static and class tokens", () => {
    class ServiceA {}
    const token1 = new StaticToken<string>("test1");

    const entries: Provider<any>[] = [
      [token1, { value: "hello" }],
      [ServiceA, { use: ServiceA }],
      [token1, { value: "hello-again" }],
    ];

    const store = new ProviderStore(entries);

    assert.deepEqual(store.get(token1), [{ value: "hello" }, { value: "hello-again" }]);
    assert.deepEqual(store.get(ServiceA), [{ use: ServiceA }]);
  });

  it("set should overwrite/replace provider definitions and return the store instance", () => {
    const store = new ProviderStore();
    const token = new StaticToken<string>("test");

    const result = store.set(token, { value: "foo" });

    assert.strictEqual(result, store);
    assert.deepEqual(store.get(token), [{ value: "foo" }]);

    store.set(token, { value: "bar" });
    assert.deepEqual(store.get(token), [{ value: "bar" }]);
  });

  it("append should add provider definitions and return the store instance (fluent API)", () => {
    const store = new ProviderStore();
    const token = new StaticToken<string>("test");

    const result = store.append(token, { value: "foo" });

    assert.strictEqual(result, store);
    assert.deepEqual(store.get(token), [{ value: "foo" }]);

    store.append(token, { value: "bar" });
    assert.deepEqual(store.get(token), [{ value: "foo" }, { value: "bar" }]);
  });

  it("get should return the same array reference for subsequent calls", () => {
    const store = new ProviderStore();
    const token = new StaticToken<string>("test");

    const providers1 = store.get(token);
    const providers2 = store.get(token);

    assert.strictEqual(providers1, providers2);

    // Modifying the returned array should modify the store's list of providers
    providers1.push({ value: "mutated" });
    assert.deepEqual(store.get(token), [{ value: "mutated" }]);
  });
});
