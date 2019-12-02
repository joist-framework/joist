import { match } from 'path-to-regexp';

describe('Router', () => {
  it('should world', () => {
    const matcher = match('/:foo/:bar', { decode: decodeURIComponent });

    console.log(matcher('/test/sadf'));

    expect(true).toBe(true);
  });
});
