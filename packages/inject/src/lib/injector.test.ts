import { expect } from '@open-wc/testing';

import { Injector } from './injector.js';
import { inject } from './inject.js';
import { injectable } from './injectable.js';

describe('Injector', () => {
  it('should create a new instance of a single provider', () => {
    class A { }

    const app = new Injector();

    expect(app.get(A)).to.be.instanceOf(A);
    expect(app.get(A)).to.equal(app.get(A));
  });

  it('should inject providers in the correct order', () => {
    class A { }
    class B { }

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
    class A { }

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
    class A { }

    @injectable
    class B {
      a = inject(A);
    }

    class AltA extends A { }
    const app = new Injector([{ provide: A, use: AltA }]);

    expect(app.get(B).a()).to.be.instanceOf(AltA);
  });

  it('should return an existing instance from a parent injector', () => {
    class A { }

    const parent = new Injector();

    const app = new Injector([], parent);

    expect(parent.get(A)).to.equal(app.get(A));
  });
});
