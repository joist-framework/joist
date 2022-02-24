import { expect } from '@open-wc/testing';

import { forwardProps } from './forward';

describe('forwardProps', () => {
  it('should map props from source to target', () => {
    const foo = {
      foo: '0',
      bar: '1',
      baz: '2',
    };

    const bar = {
      foo: '',
      bar: '',
      baz: '',
    };

    forwardProps(foo, bar, ['foo', 'bar', 'baz']);

    expect(foo.foo).to.equal(bar.foo);
  });
});
