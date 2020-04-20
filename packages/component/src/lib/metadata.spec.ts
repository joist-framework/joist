import { getComponentMetadataRef, ComponentMetadata } from './metadata';

describe('Metadata', () => {
  class A {}

  it('should add default metadata', () => {
    const metadata = getComponentMetadataRef(A);

    expect(metadata).toEqual(new ComponentMetadata());
  });
});
