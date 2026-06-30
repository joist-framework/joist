import { assert } from "chai";

import { inject, injectAll, create } from "./inject.js";
import { injectable } from "./injectable.js";
import { Injector } from "./injector.js";
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

  const injector = new Injector();
  const instance = injector.inject(HelloWorld);

  assert.strictEqual(instance.hello(), "Hello World");
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

it("should allow you to inject all defined providers", () => {
  const defaultVal = { message: "Hello World" };
  const overrideVal = { message: "Override World" };

  const TOKEN = new StaticToken("test", () => defaultVal);

  @injectable({
    providers: [[TOKEN, { factory: () => overrideVal }]],
  })
  class HelloWorld {
    hello = injectAll(TOKEN);
  }

  const injector = new Injector();
  const instance = injector.inject(HelloWorld);

  const res = instance.hello();
  assert.equal(res.length, 1);
  assert.strictEqual(res[0], overrideVal);
});

it("should create non-singleton instances", () => {
  @injectable()
  class Hello {}

  @injectable()
  class HelloWorld {
    hello = inject(Hello, { singleton: false });
  }

  const injector = new Injector();
  const instance = injector.inject(HelloWorld);

  assert.notEqual(instance.hello(), instance.hello());
});

it("should create non-singleton instances using create helper", () => {
  @injectable()
  class Hello {}

  @injectable()
  class HelloWorld {
    hello = create(Hello);
  }

  const injector = new Injector();
  const instance = injector.inject(HelloWorld);

  assert.notEqual(instance.hello(), instance.hello());
});
