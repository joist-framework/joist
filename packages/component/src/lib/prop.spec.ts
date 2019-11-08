import { Prop } from './prop';
import { readMetadata } from './metadata';

describe('Props', () => {
  class MyComponent {
    @Prop() foo?: string;
    @Prop() bar?: string;
  }

  it('should add property keys to metadata', () => {
    const metadata = readMetadata(MyComponent);

    expect(metadata.props).toEqual(['foo', 'bar']);
  });
});
