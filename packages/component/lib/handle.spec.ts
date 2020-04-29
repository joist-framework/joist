import { Handle, getComponentHandlers } from './handle';

describe('Handle', () => {
  it('should return an empy object by default', () => {
    class MyComponent {}

    expect(getComponentHandlers(MyComponent)).toEqual({});
  });

  it('should add methods to the handlers map', () => {
    class MyComponent {
      @Handle('FOO') onFoo() {}
      @Handle('BAR') onBar() {}
    }

    expect(Object.keys(getComponentHandlers(MyComponent))).toEqual(['FOO', 'BAR']);
  });
});
