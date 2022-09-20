import { expect } from '@open-wc/testing';
import { computed } from './computed.js';
import { effect } from './effect.js';
import { observable, observe } from './observable.js';

describe('computed', () => {
  it('should batch Changes', (done) => {
    @observable
    class Counter {
      @observe value = 1;

      inc() {
        this.value++;
      }
    }

    const counter1 = new Counter();
    const counter2 = new Counter();

    const combined = computed(() => {
      return counter1.value + counter2.value;
    });

    counter1.inc();
    counter1.inc();
    counter2.inc();

    const remove = effect(() => {
      expect(counter1.value).to.equal(3);
      expect(counter2.value).to.equal(2);
      expect(combined.value).to.deep.equal(5);

      done();
      remove();
    });
  });
});
