import { expect } from '@open-wc/testing';

import { property, PropValidator } from './property';
import { OnPropChanges, PropChange } from './lifecycle';
import { JoistElement } from './element';

describe('property', () => {
  it('should call onPropChanges when marked properties are changed', () => {
    let calls: PropChange[] = [];

    class MyElement extends JoistElement implements OnPropChanges {
      @property()
      public hello: string = 'Hello World';

      onPropChanges(change: PropChange) {
        calls.push(change);
      }
    }

    const el = new MyElement();

    el.hello = 'Goodbye World';

    expect(calls).to.deep.equal([
      new PropChange('hello', 'Hello World', true),
      new PropChange('hello', 'Goodbye World', false, 'Hello World'),
    ]);
  });

  it('should throw and error if the validtor returns false', () => {
    class MyElement extends JoistElement {
      @property((val: unknown) => (typeof val === 'string' ? null : {}))
      public hello: any = 'Hello World';
    }

    const el = new MyElement();

    expect(() => (el.hello = 0)).to.throw('Validation failed when assigning 0 to key hello.');
  });

  it('should throw and error if the validtor returns false with a custom error message', () => {
    const isString: PropValidator = (val: unknown) =>
      typeof val === 'string' ? null : { message: 'Should be a string yo!' };

    class MyElement extends JoistElement {
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

    class MyElement extends JoistElement {
      @property(isString, isLongerThan(2))
      public hello: any = 'Hello World';
    }

    const el = new MyElement();

    expect(() => (el.hello = 0)).to.throw('Validation failed when assigning 0 to key hello.');
    expect(() => (el.hello = 'He')).to.throw('Validation failed when assigning He to key hello.');
  });
});
