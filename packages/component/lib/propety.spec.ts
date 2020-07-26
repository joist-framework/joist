import { property } from './property';
import { OnPropChanges } from './lifecycle';

describe('property', () => {
  it('should call onPropChanges when marked properties are changed', () => {
    class MyElement implements OnPropChanges {
      @property() hello: string = 'Hello World';

      onPropChanges() {}
    }

    const el = new MyElement();

    spyOn(el, 'onPropChanges');

    el.hello = 'Goodbye World';

    expect(el.onPropChanges).toHaveBeenCalledTimes(1);
    expect(el.hello).toBe('Goodbye World');
  });
});
