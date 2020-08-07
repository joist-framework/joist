import { expect } from '@open-wc/testing';

import { inject, getProviderDeps } from './inject';

describe('inject', () => {
  class A {}
  class B {}
  class C {
    constructor(@inject(A) public a: A, @inject(B) public b: B) {}
  }

  it('should return an empty array by default', () => {
    const deps = getProviderDeps(A);

    expect(deps).to.deep.equal([]);
  });

  it('should add deps to metadata', () => {
    const deps = getProviderDeps(C);

    expect(deps).to.deep.equal([A, B]);
  });
});
