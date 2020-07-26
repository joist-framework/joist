import { handle, getComponentHandlers } from './handle';

describe('handle', () => {
  it('should return an empy object by default', () => {
    class MyComponent {}

    expect(getComponentHandlers(MyComponent)).toEqual({});
  });

  it('should add methods to the handlers map', () => {
    class MyComponent {
      @handle('FOO') onFoo() {}
      @handle('BAR') onBar() {}
    }

    expect(Object.keys(getComponentHandlers(MyComponent))).toEqual(['FOO', 'BAR']);
  });
});
