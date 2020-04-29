import { getComponentProps, Prop } from './prop';

describe('Props', () => {
  it('should return an empy array by default', () => {
    class MyComponent {}

    expect(getComponentProps(MyComponent)).toEqual([]);
  });

  it('should add methods to the handlers map', () => {
    class MyComponent {
      @Prop() foo!: string;
      @Prop() bar!: string;
    }

    expect(getComponentProps(MyComponent)).toEqual(['foo', 'bar']);
  });
});
