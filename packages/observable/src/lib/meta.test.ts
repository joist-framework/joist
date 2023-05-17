import { expect } from '@open-wc/testing';
import { MetaData } from './meta.js';

describe('meta:meta', () => {
  it('should return default metadata', () => {
    const key = {};
    const data = new MetaData().read(key);

    expect(data).to.deep.equal({
      changes: new Set(),
      effects: new Set(),
      upgradable: new Map(),
      scheduler: null,
    });
  });

  it('should return the same metadata object after init', () => {
    const key = {};
    const data = new MetaData();

    expect(data.read(key)).to.equal(data.read(key));
  });
});
