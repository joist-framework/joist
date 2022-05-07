import { expect } from '@open-wc/testing';

import { service } from './service.js';
import { isProvidedInRoot } from './utils.js';

describe('Service', () => {
  @service
  class A {}

  class B {}

  it('should be provided in root', () => {
    expect(isProvidedInRoot(A)).to.be.true;
  });

  it('should NOT be provided in root', () => {
    expect(isProvidedInRoot(B)).to.be.false;
  });
});
