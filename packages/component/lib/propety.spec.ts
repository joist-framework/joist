import { expect } from '@open-wc/testing';

import { property } from './property';
import { OnPropChanges, PropChange } from './lifecycle';

describe('property', () => {
  it('should call onPropChanges when marked properties are changed', () => {
    let calls: PropChange[] = [];

    class MyElement implements OnPropChanges {
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
    class MyElement {
      @property((val) => typeof val === 'string')
      public hello: any = 'Hello World';
    }

    const el = new MyElement();

    expect(() => (el.hello = 0)).toThrowError(`Validation failed when assigning 0 to key hello`);
  });

  it('should throw and error if ALL validators do not return true', () => {
    const isString = (val: unknown) => typeof val === 'string';
    const isLongerThan = (length: number) => (val: string) => val.length > length;

    class MyElement {
      @property(isString, isLongerThan(2))
      public hello: any = 'Hello World';
    }

    const el = new MyElement();

    expect(() => (el.hello = 0)).toThrowError(`Validation failed when assigning 0 to key hello`);
    expect(() => (el.hello = 'He')).toThrowError(
      `Validation failed when assigning He to key hello`
    );
  });
});
