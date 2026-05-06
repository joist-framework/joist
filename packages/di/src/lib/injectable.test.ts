import { assert } from "chai";

import { inject } from "./inject.js";
import { injectable } from "./injectable.js";
import { Injector } from "./injector.js";
import { readInjector } from "./metadata.js";
import { StaticToken } from "./provider.js";

it("should locally override a provider", () => {
  class Foo {}

  class Bar extends Foo {}

  @injectable({
    providers: [[Foo, { use: Bar }]],
  })
  class MyService {
    foo = inject(Foo);
  }

  const injector = new Injector();
  const instance = injector.inject(MyService);

  assert.instanceOf(instance.foo(), Bar);
});

it("should define an injector for a service instance", () => {
  @injectable()
  class MyService {}

  const injector = new Injector();
  const instance = injector.inject(MyService);

  assert.instanceOf(readInjector(instance), Injector);
});

it("should inject the current service injectable instance", () => {
  @injectable()
  class MyService {
    injector = inject(Injector);
  }

  const app = new Injector();
  const service = app.inject(MyService);

  assert.equal(service.injector(), readInjector(service));
});

it("should not override the name of the original class", () => {
  @injectable()
  class MyService {}

  assert.equal(MyService.name, "MyService");
});

it("should provide itself for spefified tokens", () => {
  const TOKEN = new StaticToken("MY_TOKEN");

  @injectable({
    provideSelfAs: [TOKEN],
  })
  class MyService {
    value = inject(TOKEN);
  }

  const injector = new Injector();
  const service = injector.inject(MyService);

  assert.equal(service.value(), service);
});

it("shoud throw error if attempting to to manually construct an injectable class", () => {
  @injectable()
  class MyService {}

  assert.throws(() => {
    new MyService();
  }, /Cannot construct an instance of MyService directly. Use the injector instead./);
});

it("shoud throw error if attempting to to manually construct an injectable class extended from a base one", () => {
  @injectable()
  class MyService {}

  class MyExtendedService extends MyService {}

  assert.throws(() => {
    new MyExtendedService();
  }, /Cannot construct an instance of MyService directly. Use the injector instead./);
});

it("should not pass the sentinal to the decorated class", () => {
  const receivedArgs: unknown[][] = [];

  @injectable()
  class MyService {
    constructor(...args: unknown[]) {
      receivedArgs.push(args);
    }
  }

  const injector = new Injector();

  injector.inject(MyService);

  assert.deepEqual(receivedArgs, [[]]);
});
