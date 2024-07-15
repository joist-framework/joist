import { expect } from '@open-wc/testing';

import { Injector } from './injector.js';
import { inject } from './inject.js';
import { injectable } from './injectable.js';
import { Provider, StaticToken } from './provider.js';

describe('Injector', () => {
  it('should create a new instance of a single provider', () => {
    class A {}

    const app = new Injector();

    expect(app.get(A)).to.be.instanceOf(A);
    expect(app.get(A)).to.equal(app.get(A));
  });

  it('should inject providers in the correct order', () => {
    class A {}
    class B {}

    @injectable
    class MyService {
      a = inject(A);
      b = inject(B);
    }

    const app = new Injector();
    const instance = app.get(MyService);

    expect(instance.a()).to.be.instanceOf(A);
    expect(instance.b()).to.be.instanceOf(B);
  });

  it('should create a new instance of a provider that has a full dep tree', () => {
    class A {}

    @injectable
    class B {
      a = inject(A);
    }

    @injectable
    class C {
      b = inject(B);
    }

    @injectable
    class D {
      c = inject(C);
    }

    @injectable
    class E {
      d = inject(D);
    }

    const app = new Injector();
    const instance = app.get(E);

    expect(instance.d().c().b().a()).to.be.instanceOf(A);
  });

  it('should override a provider if explicitly instructed', () => {
    class A {}

    @injectable
    class B {
      a = inject(A);
    }

    class AltA extends A {}
    const app = new Injector([{ provide: A, use: AltA }]);

    expect(app.get(B).a()).to.be.instanceOf(AltA);
  });

  it('should return an existing instance from a parent injector', () => {
    class A {}

    const parent = new Injector();

    const app = new Injector([], parent);

    expect(parent.get(A)).to.equal(app.get(A));
  });

  it('should use a factory if provided', () => {
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
              return 'you';
            }
          };
        }
      }
    ]);

    expect(injector.get(Service).hello()).to.equal('you');
  });

  it('should throw an error if provider is missing both factory and use', () => {
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

    expect(() => injector.get(Service)).to.throw(
      "Provider for Service found but is missing either 'use' or 'factory'"
    );
  });

  it('should pass factories and instance of the injector', (done) => {
    class Service {
      hello() {
        return 'world';
      }
    }

    const injector = new Injector([
      {
        provide: Service,
        factory(i) {
          expect(i).to.equal(injector);

          done();
        }
      }
    ]);

    injector.get(Service);
  });

  it('should create an instance from a StaticToken factory', () => {
    const token = new StaticToken('test', () => 'Hello World');
    const injector = new Injector();

    const res = injector.get(token);

    expect(res).to.equal('Hello World');
  });

  it('should create an instance from an async StaticToken factory', async () => {
    const token = new StaticToken('test', () => Promise.resolve('Hello World'));
    const injector = new Injector();

    const res = await injector.get(token);

    expect(res).to.equal('Hello World');
  });

  it('should allow static token to be overridden', () => {
    const token = new StaticToken<string>('test');

    const provider: Provider<string> = {
      provide: token,
      factory() {
        return 'Hello World';
      }
    };

    const injector = new Injector([provider]);

    const res = injector.get(token);

    expect(res).to.equal('Hello World');
  });
});
