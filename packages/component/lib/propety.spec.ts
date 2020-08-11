import { expect } from '@open-wc/testing';

import { property, PropValidator } from './property';
import { PropChange } from './lifecycle';
import { withPropChanges } from './element';

describe('property', () => {
  it('should call onPropChanges when marked properties are changed', (done) => {
    class MyElement extends withPropChanges(class {}) {
      @property()
      public hello?: string;

      onPropChanges(change: PropChange) {
        expect(change).to.deep.equal(new PropChange('hello', 'Hello World', true));

        done();
      }
    }

    new MyElement().hello = 'Hello World';
  });

  it('should call onPropChanges when marked properties are changed', (done) => {
    class MyElement extends withPropChanges(class {}) {
      @property()
      public hello: string = 'Hello World';

      onPropChanges(...changes: PropChange[]) {
        expect(changes).to.deep.equal([
          new PropChange('hello', 'Hello World', true),
          new PropChange('hello', 'Goodbye World', false, 'Hello World'),
        ]);

        done();
      }
    }

    const el = new MyElement();

    el.hello = 'Goodbye World';
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
