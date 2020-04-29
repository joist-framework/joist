import { Inject, getProviderDeps } from './inject';

describe('Inject', () => {
  class A {}
  class B {}
  class C {
    constructor(@Inject(A) public a: A, @Inject(B) public b: B) {}
  }

  it('should return an empty array by default', () => {
    const deps = getProviderDeps(A);

    expect(deps).toEqual([]);
  });

  it('should add deps to metadata', () => {
    const deps = getProviderDeps(C);

    expect(deps).toEqual([A, B]);
  });
});
