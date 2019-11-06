import { Handle } from './handle';

describe('Handle', () => {
  class MyComponent {
    @Handle('FOO') onFoo() {}
    @Handle('BAR') onBar() {}
  }

  it('should add methods to the handlers map', () => {
    const component = new MyComponent() as any;

    expect(Object.keys(component.handlers)).toEqual(['FOO', 'BAR']);
  });
});
