import test from 'node:test';
import assert from 'node:assert';

import { Injector } from './injector.js';
import { inject } from './inject.js';
import { injectable } from './injectable.js';
import { Provider, StaticToken } from './provider.js';

test('should create a new instance of a single provider', () => {
  class A {}

  const app = new Injector();

  assert(app.inject(A) instanceof A);

  assert.equal(app.inject(A), app.inject(A));
});

test('should inject providers in the correct order', () => {
  class A {}
  class B {}

  @injectable()
  class MyService {
    a = inject(A);
    b = inject(B);
  }

  const app = new Injector();
  const instance = app.inject(MyService);

  assert(instance.a() instanceof A);
  assert(instance.b() instanceof B);
});

test('should create a new instance of a provider that has a full dep tree', () => {
  class A {}

  @injectable()
  class B {
    a = inject(A);
  }

  @injectable()
  class C {
    b = inject(B);
  }

  @injectable()
  class D {
    c = inject(C);
  }

  @injectable()
  class E {
    d = inject(D);
  }

  const app = new Injector();
  const instance = app.inject(E);

  assert(instance.d().c().b().a() instanceof A);
});

test('should override a provider if explicitly instructed', () => {
  class A {}

  @injectable()
  class B {
    a = inject(A);
  }

  class AltA extends A {}
  const app = new Injector([{ provide: A, use: AltA }]);

  assert(app.inject(B).a() instanceof AltA);
});

test('should return an existing instance from a parent injector', () => {
  class A {}

  const parent = new Injector();

  const app = new Injector([], parent);

  assert.equal(parent.inject(A), app.inject(A));
});

test('should use a factory if provided', () => {
  class Service {
    hello() {
      return 'world';
    }
  }

  const injector = new Injector([
    {
      provide: Service,
      factory() {
        return {
          hello() {
            return 'world';
          }
        };
      }
    }
  ]);

  assert.equal(injector.inject(Service).hello(), 'world');
});

test('should throw an error if provider is missing both factory and use', () => {
  class Service {
    hello() {
      return 'world';
    }
  }

  const injector = new Injector([
    {
      provide: Service
    }
  ]);

  assert.throws(
    () => injector.inject(Service),
    new Error("Provider for Service found but is missing either 'use' or 'factory'")
  );
});

test('should pass factories and instance of the injector', async () => {
  class Service {
    hello() {
      return 'world';
    }
  }

  let factoryInjector: Injector | null = null;

  const injector = new Injector([
    {
      provide: Service,
      factory(i) {
        factoryInjector = i;
      }
    }
  ]);

  injector.inject(Service);

  assert.equal(factoryInjector, injector);
});

test('should create an instance from a StaticToken factory', () => {
  const TOKEN = new StaticToken('test', () => 'Hello World');
  const injector = new Injector();

  const res = injector.inject(TOKEN);

  assert.equal(res, 'Hello World');
});

test('should create an instance from an async StaticToken factory', async () => {
  const TOKEN = new StaticToken('test', () => Promise.resolve('Hello World'));
  const injector = new Injector();

  const res = await injector.inject(TOKEN);

  assert.equal(res, 'Hello World');
});

test('should allow static token to be overridden', () => {
  const TOKEN = new StaticToken<string>('test');

  const provider: Provider<string> = {
    provide: TOKEN,
    factory() {
      return 'Hello World';
    }
  };

  const injector = new Injector([provider]);

  const res = injector.inject(TOKEN);

  assert.equal(res, 'Hello World');
});
