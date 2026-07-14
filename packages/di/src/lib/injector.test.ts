import { assert } from "chai";

import { inject } from "./inject.js";
import { injectable } from "./injectable.js";
import { Injector } from "./injector.js";
import { StaticToken } from "./provider.js";

it("should create a new instance of a single provider", () => {
  class A {}

  const app = new Injector();

  assert(app.inject(A) instanceof A);

  assert.equal(app.inject(A), app.inject(A));
});

it("should inject providers in the correct order", () => {
  class A {}
  class B {}

  @injectable()
  class MyService {
    a = inject(A);
    b = inject(B);
  }

  const app = new Injector();
  const instance = app.inject(MyService);

  assert(instance.a() instanceof A);
  assert(instance.b() instanceof B);
});

it("should create a new instance of a provider that has a full dep tree", () => {
  class A {}

  @injectable()
  class B {
    a = inject(A);
  }

  @injectable()
  class C {
    b = inject(B);
  }

  @injectable()
  class D {
    c = inject(C);
  }

  @injectable()
  class E {
    d = inject(D);
  }

  const app = new Injector();
  const instance = app.inject(E);

  assert(instance.d().c().b().a() instanceof A);
});

it("should override a provider if explicitly instructed", () => {
  class A {}

  @injectable()
  class B {
    a = inject(A);
  }

  class AltA extends A {}
  const app = new Injector({
    providers: [[A, { use: AltA }]],
  });

  assert(app.inject(B).a() instanceof AltA);
});

it("should return an existing instance from a parent injector", () => {
  class A {}

  const parent = new Injector();

  const app = new Injector({
    parent,
  });

  assert.equal(parent.inject(A), app.inject(A));
});

it("should use a factory if provided", () => {
  class Service {
    hello() {
      return "world";
    }
  }

  const injector = new Injector({
    providers: [
      [
        Service,
        {
          factory() {
            return {
              hello() {
                return "world";
              },
            };
          },
        },
      ],
    ],
  });

  assert.equal(injector.inject(Service).hello(), "world");
});

it("should use a value if provided", () => {
  class Service {
    hello() {
      return "world";
    }
  }

  const instance = new Service();

  const injector = new Injector({
    providers: [[Service, { value: instance }]],
  });

  assert.equal(injector.inject(Service), instance);
});

it("should return the same value instance on repeated injection", () => {
  class Service {}

  const instance = new Service();

  const injector = new Injector({
    providers: [[Service, { value: instance }]],
  });

  assert.equal(injector.inject(Service), injector.inject(Service));
});

it("should use a value for a StaticToken", () => {
  const TOKEN = new StaticToken<string>("test");

  const injector = new Injector({
    providers: [[TOKEN, { value: "hello" }]],
  });

  assert.equal(injector.inject(TOKEN), "hello");
});

it("should throw an error if provider is missing use, factory, and value", () => {
  class Service {
    hello() {
      return "world";
    }
  }

  const injector = new Injector({
    providers: [[Service, {} as any]],
  });

  assert.throws(
    () => injector.inject(Service),
    "Provider for Service found but is missing either 'use', 'factory', or 'value'",
  );
});

it("should pass factories and instance of the injector", async () => {
  class Service {
    hello() {
      return "world";
    }
  }

  let factoryInjector: Injector | null = null;

  const injector = new Injector({
    providers: [
      [
        Service,
        {
          factory(i) {
            factoryInjector = i;
          },
        },
      ],
    ],
  });

  injector.inject(Service);

  assert.equal(factoryInjector, injector);
});

it("should create an instance from a StaticToken factory", () => {
  const TOKEN = new StaticToken("test", () => "Hello World");
  const injector = new Injector();

  const res = injector.inject(TOKEN);

  assert.equal(res, "Hello World");
});

it("should create an instance from an async StaticToken factory", async () => {
  const TOKEN = new StaticToken("test", async () => "Hello World");
  const injector = new Injector();

  const res = await injector.inject(TOKEN);

  assert.equal(res, "Hello World");
});

it("should allow static token to be overridden", () => {
  const TOKEN = new StaticToken<string>("test");

  const injector = new Injector({
    providers: [
      [
        TOKEN,
        {
          factory() {
            return "Hello World";
          },
        },
      ],
    ],
  });

  const res = injector.inject(TOKEN);

  assert.equal(res, "Hello World");
});

it("should allow you to get ALL available instances in a particular injector chain", () => {
  const TOKEN = new StaticToken<string>("TOKEN");

  const injector = new Injector({
    providers: [[TOKEN, { factory: () => "first" }]],
    parent: new Injector({
      providers: [[TOKEN, { factory: () => "second" }]],
      parent: new Injector({
        providers: [[TOKEN, { factory: () => "third" }]],
        parent: new Injector({
          providers: [[TOKEN, { factory: () => "fourth" }]],
        }),
      }),
    }),
  });

  const res = injector.injectAll(TOKEN);

  assert.deepEqual(res, ["first", "second", "third", "fourth"]);
});

it("should respect skipParent option when injecting", () => {
  class Service {
    value = "child";
  }

  const parent = new Injector({
    providers: [
      [
        Service,
        {
          use: class extends Service {
            value = "parent";
          },
        },
      ],
    ],
  });

  const child = new Injector({ parent });

  // Without skipParent, should get parent's instance
  assert.equal(child.inject(Service).value, "parent");

  // With skipParent, should get child's instance
  assert.equal(child.inject(Service, { ignoreParent: true }).value, "child");
});

it("should handle skipParent with static tokens", () => {
  const TOKEN = new StaticToken("test", () => "child-value");

  const parent = new Injector({
    providers: [[TOKEN, { factory: () => "parent-value" }]],
  });

  const child = new Injector({ parent });

  // Without skipParent, should get parent's value
  assert.equal(child.inject(TOKEN), "parent-value");

  // With skipParent, should get child's value
  assert.equal(child.inject(TOKEN, { ignoreParent: true }), "child-value");
});

it("should handle StaticToken with null/undefined factory", () => {
  const TOKEN = new StaticToken<string | null>("test");
  const injector = new Injector();

  assert.throws(() => injector.inject(TOKEN), 'Provider not found for "test"');
  assert.throws(() => injector.inject(TOKEN, { optional: false }), 'Provider not found for "test"');
  assert.equal(injector.inject(TOKEN, { optional: true }), null);
});

it("should handle StaticToken factory throwing errors", () => {
  const TOKEN = new StaticToken<string>("test", () => {
    throw new Error("Factory error");
  });
  const injector = new Injector();

  assert.throws(() => injector.inject(TOKEN), "Factory error");
});

it("should create a non singleton instance", () => {
  class A {}

  const app = new Injector();

  assert(app.inject(A) instanceof A);

  assert.notEqual(app.inject(A, { singleton: false }), app.inject(A, { singleton: false }));
});

it("should forward singleton option to parent injector", () => {
  class Service {}

  const parent = new Injector();
  const child = new Injector({ parent });

  const a = child.inject(Service, { singleton: false });
  const b = child.inject(Service, { singleton: false });

  assert.notEqual(a, b);
});

it("should assign injector name from options", () => {
  const app = new Injector({ name: "app" });

  assert.equal(app.name, "app");
});

it("should create a new instance each time with create", () => {
  class Service {}

  const app = new Injector();

  const first = app.create(Service);
  const second = app.create(Service);

  assert(first instanceof Service);
  assert(second instanceof Service);
  assert.notEqual(first, second);
});

it("should respect ignoreParent option in create", () => {
  class Service {
    value = "child";
  }

  const parent = new Injector({
    providers: [
      [
        Service,
        {
          use: class extends Service {
            value = "parent";
          },
        },
      ],
    ],
  });

  const child = new Injector({ parent });

  // Without ignoreParent, should create new instance from parent's provider
  const parentInstance = child.create(Service);
  assert.equal(parentInstance.value, "parent");

  // With ignoreParent, should create new instance from child's provider
  const childInstance = child.create(Service, { ignoreParent: true });
  assert.equal(childInstance.value, "child");
});

it("should throw when a non-service token is injected as a singleton", () => {
  @injectable({ service: false })
  class NonService {}

  const app = new Injector();

  assert.throws(
    () => app.inject(NonService),
    `Token NonService is marked as non-service and cannot be injected as a singleton. Please use create.`,
  );
});

it("should allow a non-service token to be injected with singleton: false", () => {
  @injectable({ service: false })
  class NonService {}

  const app = new Injector();

  const instance = app.inject(NonService, { singleton: false });

  assert(instance instanceof NonService);
});

it("should allow multiple non-singleton instances of a non-service token", () => {
  @injectable({ service: false })
  class NonService {}

  const app = new Injector();

  const a = app.inject(NonService, { singleton: false });
  const b = app.inject(NonService, { singleton: false });

  assert(a instanceof NonService);
  assert(b instanceof NonService);
  assert.notEqual(a, b);
});

it("should maintain separate cached instances for each unique ProviderDef under the same token", () => {
  const TOKEN = new StaticToken<{ name: string }>("multi-test");

  const provider1 = { factory: () => ({ name: "first-instance" }) };
  const provider2 = { factory: () => ({ name: "second-instance" }) };

  const injector = new Injector({
    providers: [
      [TOKEN, provider1],
      [TOKEN, provider2],
    ],
  });

  // inject should return the first provider's instance by default
  const res1 = injector.inject(TOKEN);
  assert.deepEqual(res1, { name: "first-instance" });

  // injectAll should retrieve instances for both provider definitions
  const all = injector.injectAll(TOKEN);
  assert.deepEqual(all, [{ name: "first-instance" }, { name: "second-instance" }]);

  // Subsequent call to inject/injectAll should return the same cached instances
  const res2 = injector.inject(TOKEN);
  assert.strictEqual(res1, res2);

  const all2 = injector.injectAll(TOKEN);
  assert.strictEqual(all[0], all2[0]);
  assert.strictEqual(all[1], all2[1]);
});

it("should work with multiple value providers under the same token", () => {
  const TOKEN = new StaticToken<{ value: string }>("multi-value-test");

  const val1 = { value: "first-value" };
  const val2 = { value: "second-value" };

  const provider1 = { value: val1 };
  const provider2 = { value: val2 };

  const injector = new Injector({
    providers: [
      [TOKEN, provider1],
      [TOKEN, provider2],
    ],
  });

  // inject should return the first provider's value by default
  const res1 = injector.inject(TOKEN);
  assert.strictEqual(res1, val1);

  // injectAll should retrieve values for both provider definitions
  const all = injector.injectAll(TOKEN);
  assert.strictEqual(all[0], val1);
  assert.strictEqual(all[1], val2);
});

it("should clear cached instances of provider definitions when clear is called", () => {
  const TOKEN = new StaticToken<{ name: string }>("clear-test");

  const provider1 = { factory: () => ({ name: "first" }) };
  const provider2 = { factory: () => ({ name: "second" }) };

  const injector = new Injector({
    providers: [
      [TOKEN, provider1],
      [TOKEN, provider2],
    ],
  });

  const [a1, a2] = injector.injectAll(TOKEN);
  assert.equal(a1!.name, "first");
  assert.equal(a2!.name, "second");

  // Verify caching
  const [b1, b2] = injector.injectAll(TOKEN);
  assert.strictEqual(a1, b1);
  assert.strictEqual(a2, b2);

  // Clear cache
  injector.clear();

  // New instances should be created
  const [c1, c2] = injector.injectAll(TOKEN);
  assert.notStrictEqual(a1, c1);
  assert.notStrictEqual(a2, c2);
  assert.equal(c1!.name, "first");
  assert.equal(c2!.name, "second");
});

it("should handle mixed parent-child provider definitions correctly with injectAll", () => {
  const TOKEN = new StaticToken<{ value: string }>("mixed-test");

  const childProvider1 = { factory: () => ({ value: "child-1" }) };
  const childProvider2 = { factory: () => ({ value: "child-2" }) };
  const parentProvider1 = { factory: () => ({ value: "parent-1" }) };

  const parent = new Injector({
    providers: [[TOKEN, parentProvider1]],
  });

  const child = new Injector({
    parent,
    providers: [
      [TOKEN, childProvider1],
      [TOKEN, childProvider2],
    ],
  });

  const res = child.injectAll(TOKEN);
  assert.deepEqual(res, [{ value: "child-1" }, { value: "child-2" }, { value: "parent-1" }]);

  // Check caching/reference identity
  const res2 = child.injectAll(TOKEN);
  assert.strictEqual(res[0], res2[0]);
  assert.strictEqual(res[1], res2[1]);
  assert.strictEqual(res[2], res2[2]);
});

it("should not crash when injectAll is called on a StaticToken with no local providers but parent providers exist", () => {
  const TOKEN = new StaticToken<{ value: string }>("no-local-parent-exists-test");
  const parent = new Injector({
    providers: [[TOKEN, { factory: () => ({ value: "parent" }) }]],
  });
  const child = new Injector({
    parent,
  });

  const res = child.injectAll(TOKEN);
  assert.deepEqual(res, [{ value: "parent" }]);
});

it("should return an empty array when calling injectAll on an injectable class with no explicit providers, and not pollute the child injector", () => {
  @injectable()
  class TestService {
    static count = 0;
    id = ++TestService.count;
  }

  const parent = new Injector();
  const child = new Injector({ parent });

  // 1. Resolve on child (should delegate and cache on parent)
  const firstInject = child.inject(TestService);

  // 2. Call injectAll (should return [] because there are no explicit providers, and not create a child instance)
  const injectAllRes = child.injectAll(TestService);
  assert.deepEqual(injectAllRes, []);

  // 3. Resolve subsequent inject (should still be parent instance)
  const secondInject = child.inject(TestService);
  assert.strictEqual(secondInject, firstInject);
});

it("should safely return an empty array when calling injectAll on a StaticToken with no providers", () => {
  const TOKEN = new StaticToken<{ value: string }>("optional-extension-token");
  const parent = new Injector();
  const child = new Injector({ parent });

  const res = child.injectAll(TOKEN);
  assert.deepEqual(res, []);
});
