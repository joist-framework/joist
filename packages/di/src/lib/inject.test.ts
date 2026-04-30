import { assert } from "chai";

import { create, inject, injectAll } from "./inject.js";
import { injectable } from "./injectable.js";
import { Injector } from "./injector.js";
import { readInjector } from "./metadata.js";
import { StaticToken } from "./provider.js";

it("should throw error if called in constructor", () => {
  assert.throws(() => {
    class FooService {
      value = "1";
    }

    @injectable()
    class BarService {
      foo = inject(FooService);

      constructor() {
        this.foo();
      }
    }

    const parent = new Injector();

    parent.inject(BarService);
  }, "BarService is either not injectable or a service is being called in the constructor.");
});

it("should throw error if static token is unavailable", () => {
  assert.throws(() => {
    const TOKEN = new StaticToken("test");

    const parent = new Injector();

    parent.inject(TOKEN);
  }, 'Provider not found for "test"');
});

it("should use the calling injector as parent", () => {
  class FooService {
    value = "1";
  }

  @injectable()
  class BarService {
    foo = inject(FooService);
  }

  const parent = new Injector({
    providers: [
      [
        FooService,
        {
          use: class extends FooService {
            value = "100";
          },
        },
      ],
    ],
  });

  assert.strictEqual(parent.inject(BarService).foo().value, "100");
});

it("should inject a static token", () => {
  const TOKEN = new StaticToken("test", () => "Hello World");

  @injectable()
  class HelloWorld {
    hello = inject(TOKEN);
  }

  assert.strictEqual(new HelloWorld().hello(), "Hello World");
});

it("should use the calling injector as parent", () => {
  class FooService {
    value = "1";
  }

  @injectable()
  class BarService {
    foo = inject(FooService);
  }

  const parent = new Injector({
    providers: [
      [
        FooService,
        {
          use: class extends FooService {
            value = "100";
          },
        },
      ],
    ],
  });

  assert.strictEqual(parent.inject(BarService).foo().value, "100");
});

it("should allow you to inject all", () => {
  const TOKEN = new StaticToken("test", () => "Hello World");

  @injectable()
  class HelloWorld {
    hello = injectAll(TOKEN);
  }

  assert.deepEqual(new HelloWorld().hello(), ["Hello World"]);
});

it("should create non-singleton instances", () => {
  @injectable()
  class Hello {}

  @injectable()
  class HelloWorld {
    hello = create(Hello);
  }

  const instance = new HelloWorld();
  assert.notEqual(instance.hello(), instance.hello());
});

it("should recreate the injected instance when the parent changes", () => {
  class FooService {
    value;

    constructor(value: string) {
      this.value = value;
    }
  }

  @injectable()
  class BarService {
    foo = inject(FooService);
  }

  const firstParent = new Injector({
    providers: [[FooService, { value: new FooService("first") }]],
  });
  const secondParent = new Injector({
    providers: [[FooService, { value: new FooService("second") }]],
  });

  const instance = new BarService();
  const injector = readInjector(instance);

  if (!injector) {
    throw new Error("Expected injectable instance to expose an injector");
  }

  injector.parent = firstParent;
  const firstFoo = instance.foo();

  injector.parent = secondParent;
  const secondFoo = instance.foo();

  assert.strictEqual(firstFoo.value, "first");
  assert.strictEqual(secondFoo.value, "second");
  assert.notStrictEqual(firstFoo, secondFoo);
});
