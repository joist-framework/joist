import { assert } from 'chai';

import { Injector } from './injector.js';
import { injected, created } from './lifecycle.js';
import { injectable } from './injectable.js';
import { inject } from './inject.js';

it('should call onInit and onInject when a service is first created', () => {
  const i = new Injector();

  @injectable()
  class MyService {
    res = {
      onCreated: 0,
      onInjected: 0
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
    onInjected: 1
  });
});

it('should call onInject any time a service is returned', () => {
  const i = new Injector();

  @injectable()
  class MyService {
    res = {
      onCreated: 0,
      onInjected: 0
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
    onInjected: 2
  });
});

it('should call onInject and on init when injected from another service', () => {
  const i = new Injector();

  @injectable()
  class MyService {
    res = {
      onCreated: 0,
      onInjected: 0
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
    onInjected: 2
  });
});
