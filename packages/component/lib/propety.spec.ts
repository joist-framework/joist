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

    expect(calls).toEqual([
      new PropChange('hello', 'Hello World', true),
      new PropChange('hello', 'Goodbye World', false, 'Hello World'),
    ]);
  });
});
