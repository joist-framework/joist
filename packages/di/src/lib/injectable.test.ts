import { assert } from 'chai';

import { injectable } from './injectable.js';
import { inject } from './inject.js';
import { injectables } from './injector.js';

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
  class MyService {}

  const instance = new MyService();

  assert.ok(injectables.has(instance));
});
