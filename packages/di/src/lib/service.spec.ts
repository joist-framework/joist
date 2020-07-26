import { service, isProvidedInRoot } from './service';

describe('Service', () => {
  @service()
  class A {}

  class B {}

  it('should be provided in root', () => {
    expect(isProvidedInRoot(A)).toBe(true);
  });

  it('should NOT be provided in root', () => {
    expect(isProvidedInRoot(B)).toBe(false);
  });
});
