import { Handle } from './handle';
import { readMetadata } from './metadata';

describe('Handle', () => {
  class MyComponent {
    @Handle('FOO') onFoo() {}
    @Handle('BAR') onBar() {}
  }

  it('should add methods to the handlers map', () => {
    const metadata = readMetadata(MyComponent);

    expect(Object.keys(metadata.handlers)).toEqual(['FOO', 'BAR']);
  });
});
