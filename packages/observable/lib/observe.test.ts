import { expect } from '@open-wc/testing';

import { effect, observe } from './observe.js';

describe('observable: observe()', () => {
  it('should work with static accessors', (done) => {
    class Counter {
      @observe static accessor value = 0;

      @effect static onChange() {
        expect(Counter.value).to.equal(1);

        done();
      }
    }

    expect(Counter.value).to.equal(0);

    Counter.value++;

    expect(Counter.value).to.equal(1);
  });

  it('should work with instance accessors', (done) => {
    class Counter {
      @observe accessor value = 0;

      @effect onChange() {
        expect(this.value).to.equal(1);

        done();
      }
    }

    const couter = new Counter();

    expect(couter.value).to.equal(0);

    couter.value++;

    expect(couter.value).to.equal(1);
  });

  it('should return a set of changed props', (done) => {
    class Counter {
      @observe accessor value = 0;

      @effect onChange(changes: Set<keyof this>) {
        expect(changes.has('value')).to.be.true;

        done();
      }
    }

    const couter = new Counter();
    couter.value++;
  });
});
