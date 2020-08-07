import { expect } from '@open-wc/testing';

import { handle, getComponentHandlers } from './handle';

describe('handle', () => {
  it('should return an empy object by default', () => {
    class MyComponent {}

    expect(getComponentHandlers(MyComponent)).to.deep.equal([]);
  });

  it('should add methods to the handlers map', () => {
    class MyComponent {
      @handle('foo') onFoo() {}
      @handle('bar') onBar() {}
    }

    expect(getComponentHandlers(MyComponent)).to.deep.equal([
      { pattern: 'foo', key: 'onFoo' },
      { pattern: 'bar', key: 'onBar' },
    ]);
  });
});
