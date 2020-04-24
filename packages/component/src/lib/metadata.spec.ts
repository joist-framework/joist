import { getComponentMetadata, ComponentMetadata } from './metadata';

describe('Metadata', () => {
  class A {}

  it('should add default metadata', () => {
    const metadata = getComponentMetadata(A);

    expect(metadata).toEqual(new ComponentMetadata());
  });
});
