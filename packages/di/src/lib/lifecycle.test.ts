import { assert } from "chai";

import { inject } from "./inject.js";
import { injectable } from "./injectable.js";
import { Injector } from "./injector.js";
import { created, injected } from "./lifecycle.js";
import { readInjector } from "./metadata.js";

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

  assert.equal(service.res[0], injector);
  assert.equal(service.res[0].parent, i);
  assert.equal(service.res[1], injector);
  assert.equal(service.res[1].parent, i);
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

// it("should handle dynamic conditions in lifecycle callbacks", () => {
//   const i = new Injector();
//   let shouldExecute = false;

//   @injectable()
//   class MyService {
//     res = {
//       onCreated: 0,
//       onInjected: 0,
//     };

//     @created(() => ({ enabled: shouldExecute }))
//     onCreated() {
//       this.res.onCreated++;
//     }

//     @injected(() => ({ enabled: shouldExecute }))
//     onInjected() {
//       this.res.onInjected++;
//     }
//   }

//   // First injection with shouldExecute = false
//   const service1 = i.inject(MyService);
//   assert.deepEqual(service1.res, {
//     onCreated: 0,
//     onInjected: 0,
//   });

//   // Second injection with shouldExecute = true
//   shouldExecute = true;
//   const service2 = i.inject(MyService);
//   assert.deepEqual(service2.res, {
//     onCreated: 1,
//     onInjected: 1,
//   });
// });
