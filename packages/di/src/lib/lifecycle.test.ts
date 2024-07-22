import { expect } from '@open-wc/testing';

import { Injector } from './injector.js';
import { LifeCycle } from './lifecycle.js';
import { injectable } from './injectable';
import { inject } from './inject.js';

describe('LifeCycle', () => {
  it('should call onInit and onInject when a service is first created', () => {
    const i = new Injector();

    const res = {
      onInit: 0,
      onInject: 0
    };

    @injectable
    class MyService {
      [LifeCycle.onInit]() {
        res.onInit++;
      }

      [LifeCycle.onInject]() {
        res.onInject++;
      }
    }

    i.inject(MyService);

    expect(res).to.deep.equal({
      onInit: 1,
      onInject: 1
    });
  });

  it('should call onInject any time a service is returned', () => {
    const i = new Injector();

    const res = {
      onInit: 0,
      onInject: 0
    };

    @injectable
    class MyService {
      [LifeCycle.onInit]() {
        res.onInit++;
      }

      [LifeCycle.onInject]() {
        res.onInject++;
      }
    }

    i.inject(MyService);
    i.inject(MyService);

    expect(res).to.deep.equal({
      onInit: 1,
      onInject: 2
    });
  });

  it('should call onInject and on init when injected from another service', () => {
    const i = new Injector();

    const res = {
      onInit: 0,
      onInject: 0
    };

    @injectable
    class MyService {
      [LifeCycle.onInit]() {
        res.onInit++;
      }

      [LifeCycle.onInject]() {
        res.onInject++;
      }
    }

    @injectable
    class MyApp {
      service = inject(MyService);
    }

    i.inject(MyApp).service();
    i.inject(MyService);

    expect(res).to.deep.equal({
      onInit: 1,
      onInject: 2
    });
  });
});
