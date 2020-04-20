import { Handle } from './handle';
import { getComponentMetadataRef } from './metadata';

describe('Handle', () => {
  class MyComponent {
    @Handle('FOO') onFoo() {}
    @Handle('BAR') onBar() {}
  }

  it('should add methods to the handlers map', () => {
    const metadata = getComponentMetadataRef(MyComponent);

    expect(Object.keys(metadata.handlers)).toEqual(['FOO', 'BAR']);
  });
});
