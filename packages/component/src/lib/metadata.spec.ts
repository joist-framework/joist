import { getMetadataRef, Metadata } from './metadata';

describe('Metadata', () => {
  class A {}

  it('should add default metadata', () => {
    const metadata = getMetadataRef(A);

    expect(metadata).toEqual(new Metadata());
  });
});
