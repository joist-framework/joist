import { assert } from "chai";

import { inject } from "./inject.js";
import { injectable } from "./injectable.js";
import { Injector } from "./injector.js";
import { created, injected, destroyed } from "./lifecycle.js";
import { readInjector } from "./metadata.js";
import type { LifecycleCallback } from "./metadata.js";
import { StaticToken } from "./provider.js";

it("should call onInit and onInject when a service is first created", () => {
  const i = new Injector();

  @injectable()
  class MyService {
    res = {
      onCreated: 0,
      onInjected: 0,
    };

    @created()
    onCreated() {
      this.res.onCreated++;
    }

    @injected()
    onInjected() {
      this.res.onInjected++;
    }
  }

  const service = i.inject(MyService);

  assert.deepEqual(service.res, {
    onCreated: 1,
    onInjected: 1,
  });
});

it("should pass the injector to all lifecycle callbacks", () => {
  const i = new Injector();

  @injectable({
    name: "MyService",
  })
  class MyService {
    res: Injector[] = [];

    @created()
    onCreated(i: Injector) {
      this.res.push(i);
    }

    @injected()
    onInjected(i: Injector) {
      this.res.push(i);
    }
  }

  const service = i.inject(MyService);
  const injector = readInjector(service);

  assert.equal(service.res[0]!, injector);
  assert.equal(service.res[0]!, i); // Optimized: shares root injector directly
  assert.equal(service.res[1]!, injector);
  assert.equal(service.res[1]!, i);

  // Test with providers (unoptimized scope)
  @injectable({
    name: "MyScopedService",
    providers: [],
  })
  class MyScopedService {
    res: Injector[] = [];

    @created()
    onCreated(i: Injector) {
      this.res.push(i);
    }
  }

  const scopedService = i.inject(MyScopedService);
  const scopedInjector = readInjector(scopedService);

  assert.equal(scopedService.res[0]!, scopedInjector);
  assert.equal(scopedService.res[0]!.parent, i); // Unoptimized: creates child injector
});

it("should call onInject any time a service is returned", () => {
  const i = new Injector();

  @injectable()
  class MyService {
    res = {
      onCreated: 0,
      onInjected: 0,
    };

    @created()
    onCreated() {
      this.res.onCreated++;
    }

    @injected()
    onInjected() {
      this.res.onInjected++;
    }
  }

  i.inject(MyService);
  const service = i.inject(MyService);

  assert.deepEqual(service.res, {
    onCreated: 1,
    onInjected: 2,
  });
});

it("should call onInject and on init when injected from another service", () => {
  const i = new Injector();

  @injectable()
  class MyService {
    res = {
      onCreated: 0,
      onInjected: 0,
    };

    @created()
    onCreated() {
      this.res.onCreated++;
    }

    @injected()
    onInjected() {
      this.res.onInjected++;
    }
  }

  @injectable()
  class MyApp {
    service = inject(MyService);
  }

  i.inject(MyApp).service();
  const service = i.inject(MyService);

  assert.deepEqual(service.res, {
    onCreated: 1,
    onInjected: 2,
  });
});

it("should respect enabled=false condition in lifecycle callbacks", () => {
  const i = new Injector();

  @injectable()
  class MyService {
    res = {
      onCreated: 0,
      onInjected: 0,
    };

    @created(() => ({ enabled: false }))
    onCreated() {
      this.res.onCreated++;
    }

    @injected(() => ({ enabled: false }))
    onInjected() {
      this.res.onInjected++;
    }
  }

  const service = i.inject(MyService);

  assert.deepEqual(service.res, {
    onCreated: 0,
    onInjected: 0,
  });
});

it("should respect enabled=true condition in lifecycle callbacks", () => {
  const i = new Injector();

  @injectable()
  class MyService {
    res = {
      onCreated: 0,
      onInjected: 0,
    };

    @created(() => ({ enabled: true }))
    onCreated() {
      this.res.onCreated++;
    }

    @injected(() => ({ enabled: true }))
    onInjected() {
      this.res.onInjected++;
    }
  }

  const service = i.inject(MyService);

  assert.deepEqual(service.res, {
    onCreated: 1,
    onInjected: 1,
  });
});

it("should execute callbacks when condition returns undefined enabled", () => {
  const i = new Injector();

  @injectable()
  class MyService {
    res = {
      onCreated: 0,
      onInjected: 0,
    };

    @created(() => ({ enabled: undefined }))
    onCreated() {
      this.res.onCreated++;
    }

    @injected(() => ({ enabled: undefined }))
    onInjected() {
      this.res.onInjected++;
    }
  }

  const service = i.inject(MyService);

  assert.deepEqual(service.res, {
    onCreated: 1,
    onInjected: 1,
  });
});

it("should execute callbacks when condition returns empty object", () => {
  const i = new Injector();

  @injectable()
  class MyService {
    res = {
      onCreated: 0,
      onInjected: 0,
    };

    @created(() => ({}))
    onCreated() {
      this.res.onCreated++;
    }

    @injected(() => ({}))
    onInjected() {
      this.res.onInjected++;
    }
  }

  const service = i.inject(MyService);

  assert.deepEqual(service.res, {
    onCreated: 1,
    onInjected: 1,
  });
});

it("should pass the injector to the condition", () => {
  const IS_PROD = new StaticToken("isProd", () => false);

  const i = new Injector();

  function isProd() {
    return (val: LifecycleCallback, ctx: ClassMethodDecoratorContext) => {
      created(({ injector }) => {
        const enabled = injector.inject(IS_PROD);
        return { enabled };
      })(val, ctx);
    };
  }

  @injectable()
  class MyService {
    count = 0;

    @isProd()
    onCreated() {
      this.count++;
    }
  }

  const service = i.inject(MyService);
  assert.equal(service.count, 0); // Not called because count is 0
});

it("should pass the instance to the condition", () => {
  const i = new Injector();

  @injectable()
  class MyService {
    enabled = false;
    count = 0;

    @created(({ instance }) => ({ enabled: instance.enabled }))
    onCreated() {
      this.count++;
    }
  }

  const service = i.inject(MyService);
  assert.equal(service.count, 0); // not called because instance.enabled is false
});

it("should call onDestroyed when the injector is cleared", () => {
  const i = new Injector();

  @injectable()
  class MyService {
    destroyedCount = 0;

    @destroyed()
    onDestroy() {
      this.destroyedCount++;
    }
  }

  const service = i.inject(MyService);
  assert.equal(service.destroyedCount, 0);

  i.clear();
  assert.equal(service.destroyedCount, 1);
});

it("should pass the injector to the onDestroyed callback", () => {
  const i = new Injector();
  let passedInjector: Injector | null = null;

  @injectable()
  class MyService {
    @destroyed()
    onDestroy(inj: Injector) {
      passedInjector = inj;
    }
  }

  i.inject(MyService);
  i.clear();

  assert.strictEqual(passedInjector, i);
});

it("should respect conditions on the @destroyed hook", () => {
  const i = new Injector();

  @injectable()
  class MyService {
    destroyedCount = 0;
    shouldDestroy = false;

    @destroyed(({ instance }) => ({ enabled: instance.shouldDestroy }))
    onDestroy() {
      this.destroyedCount++;
    }
  }

  const service = i.inject(MyService);
  i.clear();
  assert.equal(service.destroyedCount, 0); // shouldDestroy was false

  const service2 = i.inject(MyService);
  service2.shouldDestroy = true;
  i.clear();
  assert.equal(service2.destroyedCount, 1); // shouldDestroy was true
});
