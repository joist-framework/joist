import { expect } from '@open-wc/testing';
import { ObservableInstanceMetaDataStore } from './meta.js';

describe('meta:meta', () => {
  it('should return default metadata', () => {
    const key = {};
    const data = new ObservableInstanceMetaDataStore().read(key);

    expect(data).to.deep.equal({
      changes: new Set(),
      upgradable: new Map(),
      scheduler: null,
    });
  });

  it('should return the same metadata object after init', () => {
    const key = {};
    const data = new ObservableInstanceMetaDataStore();

    expect(data.read(key)).to.equal(data.read(key));
  });
});
