import { Prop } from './prop';

describe('Props', () => {
  class MyComponent {
    @Prop() foo?: string;
    @Prop() bar?: string;
  }

  it('should add property keys to metadata', () => {
    const component = new MyComponent() as any;

    expect(component.props).toEqual(['foo', 'bar']);
  });
});
