import { expect } from '@open-wc/testing';

import { property } from './property';
import { PropChange, PropChanges } from './lifecycle';
import { withPropChanges } from './element';

describe('property', () => {
  it('should call onPropChanges when marked properties are changed', (done) => {
    class MyElement extends withPropChanges(class {}) {
      @property()
      public hello?: string;

      onPropChanges(changes: PropChanges) {
        expect(changes.get('hello')).to.deep.equal(new PropChange('hello', 'Hello World', true));

        done();
      }
    }

    new MyElement().hello = 'Hello World';
  });

  it('should call batch calls to on propChanges so only the latest change is passed in', (done) => {
    class MyElement extends withPropChanges(class {}) {
      @property()
      public hello: string = 'Hello World';

      onPropChanges(changes: PropChanges) {
        expect(changes.get('hello')).to.deep.equal(
          new PropChange('hello', 'Final', false, 'Goodbye World')
        );

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

      onPropChanges(changes: PropChanges) {
        expect(Array.from(changes.values())).to.deep.equal([
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
});
