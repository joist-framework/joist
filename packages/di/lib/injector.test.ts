import { expect } from '@open-wc/testing';

import { Injector, Injected } from './injector';

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

    class MyService {
      static inject = [A, B];

      constructor(public a: Injected<A>, public b: Injected<B>) {}
    }

    const app = new Injector();
    const instance = app.get(MyService);

    expect(instance.a()).to.be.instanceOf(A);
    expect(instance.b()).to.be.instanceOf(B);
  });

  it('should create a new instance of a provider that has a full dep tree', () => {
    class A {}

    class B {
      static inject = [A];

      constructor(public a: Injected<A>) {}
    }

    class C {
      static inject = [B];

      constructor(public b: Injected<B>) {}
    }

    class D {
      static inject = [C];

      constructor(public c: Injected<C>) {}
    }

    class E {
      static inject = [D];

      constructor(public d: Injected<D>) {}
    }

    const app = new Injector();
    const instance = app.get(E);

    expect(instance.d().c().b().a()).to.be.instanceOf(A);
  });

  it('should override a provider if explicitly instructed', () => {
    class A {}

    class B {
      static inject = [A];

      constructor(public a: Injected<A>) {}
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

  it('should allow a provider to be defined with the token only', () => {
    class A {}

    const parent = new Injector();
    const app = new Injector([A], parent);

    expect(parent.get(A)).to.not.equal(app.get(A));
  });
});
