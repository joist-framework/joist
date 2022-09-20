import { expect } from '@open-wc/testing';
import { computed } from './computed.js';
import { effect } from './effect.js';
import { observable, observe } from './observable.js';

describe('computed', () => {
  it('should batch Changes', (done) => {
    @observable
    class Counter {
      @observe value = 1;
    }

    const counter1 = new Counter();
    const counter2 = new Counter();

    const combined = computed(() => {
      return counter1.value + counter2.value;
    });

    expect(combined.value).to.deep.equal(2);

    counter1.value++;
    counter1.value++;
    counter2.value++;

    const detach = effect(() => {
      expect(combined.value).to.equal(5);

      detach();
      combined.detach();

      done();
    });
  });

  it('should compute from another computed value', (done) => {
    @observable
    class Counter {
      @observe value = 1;
    }

    const counter = new Counter();
    const doubled = computed(() => counter.value * 2);
    const trippled = computed(() => doubled.value * 3);

    expect(doubled.value).to.equal(2);
    expect(trippled.value).to.equal(6);

    counter.value++;

    const detach = effect(() => {
      expect(doubled.value).to.equal(4);
      expect(trippled.value).to.equal(12);

      detach();
      doubled.detach();
      trippled.detach();

      done();
    });
  });
});
