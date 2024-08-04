import { assert } from 'chai';

import { Injector } from './injector.js';
import { LifeCycle } from './lifecycle.js';
import { injectable } from './injectable';
import { inject } from './inject.js';

describe('LifeCycle', () => {
  it('should call onInit and onInject when a service is first created', () => {
    const i = new Injector();

    @injectable()
    class MyService {
      res = {
        onInit: 0,
        onInject: 0
      };

      [LifeCycle.onInit]() {
        this.res.onInit++;
      }

      [LifeCycle.onInject]() {
        this.res.onInject++;
      }
    }

    const service = i.inject(MyService);

    assert.deepEqual(service.res, {
      onInit: 1,
      onInject: 1
    });
  });

  it('should call onInject any time a service is returned', () => {
    const i = new Injector();

    @injectable()
    class MyService {
      res = {
        onInit: 0,
        onInject: 0
      };

      [LifeCycle.onInit]() {
        this.res.onInit++;
      }

      [LifeCycle.onInject]() {
        this.res.onInject++;
      }
    }

    i.inject(MyService);
    const service = i.inject(MyService);

    assert.deepEqual(service.res, {
      onInit: 1,
      onInject: 2
    });
  });

  it('should call onInject and on init when injected from another service', () => {
    const i = new Injector();

    @injectable()
    class MyService {
      res = {
        onInit: 0,
        onInject: 0
      };

      [LifeCycle.onInit]() {
        this.res.onInit++;
      }

      [LifeCycle.onInject]() {
        this.res.onInject++;
      }
    }

    @injectable()
    class MyApp {
      service = inject(MyService);
    }

    i.inject(MyApp).service();
    const service = i.inject(MyService);

    assert.deepEqual(service.res, {
      onInit: 1,
      onInject: 2
    });
  });
});
