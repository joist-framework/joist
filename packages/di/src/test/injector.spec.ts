import { Injector, ProviderToken, Inject } from '../public_api';
import { RootService } from '../lib/service';

describe('Injector', () => {
  it('should create a new instance of a single provider', () => {
    class MyService {
      foo = 'Hello World';
    }

    const app = new Injector();

    expect(app.get(MyService).foo).toBe('Hello World');
  });

  it('should inject providers in the correct order', () => {
    class FooService {
      foo = 'FOO';
    }

    class BarService {
      bar = 'BAR';
    }

    class MyService {
      readonly value = this.foo.foo + this.bar.bar;

      constructor(
        @Inject(FooService) private foo: FooService,
        @Inject(BarService) private bar: BarService
      ) {}
    }

    const app = new Injector();

    expect(app.get(MyService).value).toBe('FOOBAR');
  });

  it('should create a new instance of a provider with a dependency', () => {
    class BarService {
      foo = 'Hello World';
    }

    class FooService {
      constructor(@Inject(BarService) private bar: BarService) {}

      sayHello() {
        return this.bar.foo;
      }
    }

    const app = new Injector();

    expect(app.get(FooService).sayHello()).toBe('Hello World');
  });

  it('should create a new instance of a provider that has a full dep tree', () => {
    class A {
      sayHello() {
        return '|';
      }
    }

    class B {
      constructor(@Inject(A) private a: A) {}

      sayHello() {
        return this.a.sayHello() + '|';
      }
    }

    class C {
      constructor(@Inject(A) private a: A, @Inject(B) private b: B) {}

      sayHello() {
        return this.a.sayHello() + '|' + this.b.sayHello();
      }
    }

    class D {
      constructor(@Inject(A) private a: A, @Inject(B) private b: B, @Inject(C) private c: C) {}

      sayHello() {
        return this.a.sayHello() + '|' + this.b.sayHello() + this.c.sayHello();
      }
    }

    class E {
      constructor(@Inject(D) private d: D) {}

      sayHello() {
        return this.d.sayHello() + '|';
      }
    }

    const app = new Injector();

    expect(app.get(E).sayHello()).toBe('|||||||||');
  });

  it('should override a provider if explicitly instructed', () => {
    class BarService {
      foo = 'Hello World';
    }

    class FooService {
      constructor(@Inject(BarService) private bar: BarService) {}

      sayHello() {
        return this.bar.foo;
      }
    }

    expect(new Injector().get(FooService).sayHello()).toBe('Hello World');

    expect(
      new Injector({
        providers: [
          {
            provide: BarService,
            useClass: class implements BarService {
              foo = 'Goodbye World';
            }
          }
        ]
      })
        .get(FooService)
        .sayHello()
    ).toBe('Goodbye World');
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

    expect(initialized).toEqual([FooService, BarService]);
  });

  it('should return the same instance when called', () => {
    class BarService {}

    class FooService {
      constructor(@Inject(BarService) public bar: BarService) {}
    }

    const app = new Injector();

    expect(app.get(FooService).bar).toBe(app.get(BarService));
  });

  it('should return different instances', () => {
    class BarService {}

    class FooService {
      constructor(@Inject(BarService) public bar: BarService) {}
    }

    const app = new Injector();

    expect(app.create(FooService)).not.toBe(app.get(FooService));
  });

  it('should return an instance from a parent injector', () => {
    class BarService {}

    class FooService {
      constructor(@Inject(BarService) public bar: BarService) {}
    }

    const parent = new Injector();
    const child1 = new Injector({}, parent);
    const child2 = new Injector({}, child1);

    const app = new Injector({}, child2);

    expect(parent.get(FooService)).toBe(app.get(FooService));
  });

  it('should use the override in scope over everything else', () => {
    class BarService {}

    class FooService {
      constructor(@Inject(BarService) public bar: BarService) {}
    }

    const parent = new Injector();
    const child1 = new Injector({}, parent);
    const child2 = new Injector({}, child1);

    const app = new Injector(
      {
        providers: [
          {
            provide: FooService,
            useClass: class extends FooService {}
          }
        ]
      },
      child2
    );

    expect(parent.get(FooService)).not.toBe(app.get(FooService));
  });

  it('should be able to use an abstract class as an injection token', () => {
    abstract class MyService {
      abstract sayHello(): string;
    }

    const app = new Injector({
      providers: [
        {
          provide: MyService,
          useClass: class implements MyService {
            sayHello() {
              return 'TESTING';
            }
          }
        }
      ]
    });

    expect(app.get(MyService).sayHello()).toBe('TESTING');
  });

  it('should return an instance when using a factory provider', () => {
    class MyService {
      constructor(private test: string) {}

      sayHello(): string {
        return 'HELLO WORLD ' + this.test;
      }
    }

    const app = new Injector({
      providers: [
        {
          provide: MyService,
          useFactory(): MyService {
            return new MyService('TEST');
          }
        }
      ]
    });

    expect(app.get(MyService).sayHello()).toBe('HELLO WORLD TEST');
  });

  it('should return an instance when using a factory provider with deps', () => {
    class MyFirstService {
      sayHello() {
        return 'TESTING';
      }
    }

    class MyService {
      constructor(private test: MyFirstService) {}

      sayHello(): string {
        return 'HELLO WORLD ' + this.test.sayHello();
      }
    }

    const app = new Injector({
      providers: [
        {
          provide: MyService,
          useFactory(first: MyFirstService): MyService {
            return new MyService(first);
          },
          deps: [MyFirstService]
        }
      ]
    });

    expect(app.get(MyService).sayHello()).toBe('HELLO WORLD TESTING');
  });

  it('should world with custom decortors', () => {
    class MyFirstService {
      sayHello() {
        return 'TESTING';
      }
    }

    const MyFirst = () => (c: any, k: string, i: number) => Inject(MyFirstService)(c, k, i);

    class MyService {
      constructor(@MyFirst() private test: MyFirstService) {}

      sayHello(): string {
        return 'HELLO WORLD ' + this.test.sayHello();
      }
    }

    const app = new Injector();

    expect(app.get(MyService).sayHello()).toBe('HELLO WORLD TESTING');
  });

  it('should use the parent Injector if specified', () => {
    @RootService()
    class BarService {}

    @RootService()
    class FooService {
      constructor(@Inject(BarService) public bar: BarService) {}
    }

    const parent = new Injector();
    const child1 = new Injector({}, parent);
    const child2 = new Injector({}, child1);

    const app = new Injector({}, child2);

    expect(app.get(FooService)).toBe(parent.get(FooService));
  });
});
