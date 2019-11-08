import { Handle } from './handle';
import { metaDataCache, MetaData } from './metadata';

describe('Handle', () => {
  class MyComponent {
    @Handle('FOO') onFoo() {}
    @Handle('BAR') onBar() {}
  }

  it('should add methods to the handlers map', () => {
    const metadata = metaDataCache.get(MyComponent) as MetaData<any>;

    expect(Object.keys(metadata.handlers)).toEqual(['FOO', 'BAR']);
  });
});
