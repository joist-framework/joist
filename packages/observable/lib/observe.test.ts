import { expect } from '@open-wc/testing';

import { observe, effect } from './observe.js';

describe('observable: attr()', () => {
  it('should do stuff', (done) => {
    class Counter {
      @observe accessor value = 0;
    }

    const el = new Counter();

    expect(el.value).to.equal(0);

    const detach = effect(() => {
      expect(el.value).to.equal(1);

      done();
      detach();
    });

    el.value++;
  });
});
