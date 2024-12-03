import { assert } from 'chai';

import { injectable } from './injectable.js';
import { inject } from './inject.js';
import { injectables, Injector } from './injector.js';

it('should locally override a provider', () => {
  class Foo {}

  class Bar extends Foo {}

  @injectable({
    providers: [{ provide: Foo, use: Bar }]
  })
  class MyService {
    foo = inject(Foo);
  }

  const el = new MyService();

  assert.instanceOf(el.foo(), Bar);
});

it('should define an injector for a service instance', () => {
  @injectable()
  class MyService {
    constructor(public arg = 'a') {}
  }

  const instance = new MyService('b');

  assert.ok(injectables.has(instance));
  assert.ok(instance.arg === 'b');
});

it('should inject the current service injectable instance', () => {
  @injectable()
  class MyService {
    injector = inject(Injector);
  }

  const app = new Injector();
  const service = app.inject(MyService);

  assert.equal(service.injector(), injectables.get(service));
});
