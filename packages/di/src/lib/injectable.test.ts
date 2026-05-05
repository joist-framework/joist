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
