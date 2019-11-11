import { getMetadataRef } from './metadata';
import { Service } from './service';

describe('Service', () => {
  @Service()
  class A {}

  it('servie provideInRoot should be true', () => {
    const metadata = getMetadataRef(A);

    expect(metadata.provideInRoot).toBe(true);
  });
});
