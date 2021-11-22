import { expect } from '@open-wc/testing';

import { inject } from './inject';
import { readProviderDeps } from '../lib/utils';

describe('inject', () => {
  class A {}
  class B {}
  class C {
    constructor(@inject(A) public a: A, @inject(B) public b: B) {}
  }

  it('should return an empty array by default', () => {
    const deps = readProviderDeps(A);

    expect(deps).to.deep.equal([]);
  });

  it('should add deps to metadata', () => {
    const deps = readProviderDeps(C);

    expect(deps).to.deep.equal([A, B]);
  });
});
