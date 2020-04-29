import { Service, isProvidedInRoot } from './service';

describe('Service', () => {
  @Service()
  class A {}

  it('servie provideInRoot should be true', () => {
    expect(isProvidedInRoot(A)).toBe(true);
  });
});
