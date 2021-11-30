import { expect } from '@open-wc/testing';

import { service } from './service';
import { Injector } from './injector';
import { ProviderToken } from './provider';

describe('Injector', () => {
  it('should create a new instance of a single provider', () => {
    class A {
      foo = 'Hello World';
    }

    const app = new Injector();

    expect(app.get(A).foo).to.equal('Hello World');
  });

  it('should inject providers in the correct order', () => {
    class FooService {
      foo = 'FOO';
    }

    class BarService {
      bar = 'BAR';
    }

    class MyService {
      static deps = [FooService, BarService];

      get value() {
        return this.foo.foo + this.bar.bar;
      }

      constructor(private foo: FooService, private bar: BarService) {}
    }

    const app = new Injector();

    expect(app.get(MyService).value).to.equal('FOOBAR');
  });

  it('should create a new instance of a provider that has a full dep tree', () => {
    class A {
      sayHello() {
        return '|';
      }
    }

    class B {
      static deps = [A];

      constructor(private a: A) {}

      sayHello() {
        return this.a.sayHello() + '|';
      }
    }

    class C {
      static deps = [A, B];

      constructor(private a: A, private b: B) {}

      sayHello() {
        return this.a.sayHello() + '|' + this.b.sayHello();
      }
    }

    class D {
      static deps = [A, B, C];

      constructor(private a: A, private b: B, private c: C) {}

      sayHello() {
        return this.a.sayHello() + '|' + this.b.sayHello() + this.c.sayHello();
      }
    }

    class E {
      static deps = [D];

      constructor(private d: D) {}

      sayHello() {
        return this.d.sayHello() + '|';
      }
    }

    const app = new Injector();

    expect(app.get(E).sayHello()).to.equal('|||||||||');
  });

  it('should override a provider if explicitly instructed', () => {
    class BarService {
      foo = 'Hello World';
    }

    class FooService {
      static deps = [BarService];

      constructor(private bar: BarService) {}

      sayHello() {
        return this.bar.foo;
      }
    }

    expect(new Injector().get(FooService).sayHello()).to.equal('Hello World');

    expect(
      new Injector({
        providers: [
          {
            provide: BarService,
            use: class implements BarService {
              foo = 'Goodbye World';
            },
          },
        ],
      })
        .get(FooService)
        .sayHello()
    ).to.equal('Goodbye World');
  });

  it('immediately initialize specified providers', () => {
    const initialized: ProviderToken<any>[] = [];

    class BarService {
      constructor() {
        initialized.push(BarService);
      }
    }

    class FooService {
      constructor() {
        initialized.push(FooService);
      }
    }

    new Injector({ bootstrap: [FooService, BarService] });

    expect(initialized).to.deep.equal([FooService, BarService]);
  });

  it('should return the same instance when called', () => {
    class BarService {}

    class FooService {
      static deps = [BarService];

      constructor(public bar: BarService) {}
    }

    const app = new Injector();

    expect(app.get(FooService).bar).to.equal(app.get(BarService));
  });

  it('should return different instances', () => {
    class BarService {}

    class FooService {
      static deps = [BarService];

      constructor(public bar: BarService) {}
    }

    const app = new Injector();

    expect(app.create(FooService)).not.to.equal(app.get(FooService));
  });

  it('should return an instance from a parent injector', () => {
    class BarService {}

    class FooService {
      static deps = [BarService];

      constructor(public bar: BarService) {}
    }

    const parent = new Injector();
    const child1 = new Injector({}, parent);
    const child2 = new Injector({}, child1);

    const app = new Injector({}, child2);

    expect(parent.get(FooService)).to.equal(app.get(FooService));
  });

  it('should use the override in scope over everything else', () => {
    class BarService {}

    class FooService {
      static deps = [BarService];

      constructor(public bar: BarService) {}
    }

    const parent = new Injector();
    const child1 = new Injector({}, parent);
    const child2 = new Injector({}, child1);

    const app = new Injector(
      {
        providers: [
          {
            provide: FooService,
            use: class extends FooService {},
          },
        ],
      },
      child2
    );

    expect(parent.get(FooService)).not.to.equal(app.get(FooService));
  });

  it('should be able to use an abstract class as an injection token', () => {
    abstract class MyService {
      abstract sayHello(): string;
    }

    const app = new Injector({
      providers: [
        {
          provide: MyService,
          use: class implements MyService {
            sayHello() {
              return 'TESTING';
            }
          },
        },
      ],
    });

    expect(app.get(MyService).sayHello()).to.equal('TESTING');
  });

  it('should use the root Injector if specified', () => {
    @service
    class BarService {}

    class FooService {
      static deps = [BarService];

      constructor(public bar: BarService) {}
    }

    const parent = new Injector();
    const child1 = new Injector({}, parent);
    const child2 = new Injector({}, child1);

    const app = new Injector({}, child2);

    expect(app.get(FooService).bar).to.equal(parent.get(BarService));
  });
});
