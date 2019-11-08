import { Prop } from './prop';
import { metaDataCache, MetaData } from './metadata';

describe('Props', () => {
  class MyComponent {
    @Prop() foo?: string;
    @Prop() bar?: string;
  }

  it('should add property keys to metadata', () => {
    const metadata = metaDataCache.get(MyComponent) as MetaData<any>;

    expect(metadata.props).toEqual(['foo', 'bar']);
  });
});
