import { expect } from '@open-wc/testing';

import { property, PropValidator } from './property';
import { PropChange } from './lifecycle';
import { withPropChanges } from './element';

describe('property', () => {
  it('should call onPropChanges when marked properties are changed', (done) => {
    class MyElement extends withPropChanges(class {}) {
      @property()
      public hello?: string;

      onPropChanges(changes: PropChange[]) {
        expect(changes).to.deep.equal([new PropChange('hello', 'Hello World', true)]);

        done();
      }
    }

    new MyElement().hello = 'Hello World';
  });

  it('should call batch calls to on propChanges so only the latest change is passed in', (done) => {
    class MyElement extends withPropChanges(class {}) {
      @property()
      public hello: string = 'Hello World';

      onPropChanges(changes: PropChange[]) {
        expect(changes).to.deep.equal([new PropChange('hello', 'Final', false, 'Goodbye World')]);

        done();
      }
    }

    const el = new MyElement();
    el.hello = 'Goodbye World';
    el.hello = 'Final';
  });

  it('should call batch calls to on propChanges so that onPropChanges is only called once for multiple changes', (done) => {
    class MyElement extends withPropChanges(class {}) {
      @property()
      public foo = 'FOO';

      @property()
      public bar = 'BAR';

      onPropChanges(changes: PropChange[]) {
        expect(changes).to.deep.equal([
          new PropChange('foo', 'Hello', false, 'FOO'),
          new PropChange('bar', 'World', false, 'BAR'),
        ]);

        done();
      }
    }

    const el = new MyElement();
    el.foo = 'Hello';
    el.bar = 'World';
  });

  it('should throw and error if the validtor returns false', () => {
    class MyElement extends withPropChanges(class {}) {
      @property((val: unknown) => (typeof val === 'string' ? null : {}))
      public hello: any = 'Hello World';
    }

    const el = new MyElement();

    expect(() => (el.hello = 0)).to.throw('Validation failed when assigning 0 to key hello.');
  });

  it('should throw and error if the validtor returns false with a custom error message', () => {
    const isString: PropValidator = (val: unknown) =>
      typeof val === 'string' ? null : { message: 'Should be a string yo!' };

    class MyElement extends withPropChanges(class {}) {
      @property(isString)
      public hello: any = 'Hello World';
    }

    const el = new MyElement();

    expect(() => (el.hello = 0)).to.throw(
      'Validation failed when assigning 0 to key hello. Should be a string yo!'
    );
  });

  it('should throw and error if ALL validators do not return true', () => {
    const isString: PropValidator = (val: unknown) => (typeof val === 'string' ? null : {});
    const isLongerThan = (length: number) => (val: string) => (val.length > length ? null : {});

    class MyElement extends withPropChanges(class {}) {
      @property(isString, isLongerThan(2))
      public hello: any = 'Hello World';
    }

    const el = new MyElement();

    expect(() => (el.hello = 0)).to.throw('Validation failed when assigning 0 to key hello.');
    expect(() => (el.hello = 'He')).to.throw('Validation failed when assigning He to key hello.');
  });
});
