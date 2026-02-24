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

it("should throw an error if provider is missing both factory and use", () => {
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
    "Provider for Service found but is missing either 'use' or 'factory'",
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
