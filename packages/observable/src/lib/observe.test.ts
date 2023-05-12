import { expect, fixture, html } from '@open-wc/testing';

import { effect, observe } from './observe.js';

describe('observable: observe()', () => {
  it('should work with static accessors', (done) => {
    class Counter {
      @observe static accessor value = 0;

      @effect static onPropChanged() {
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

      // confirm it works with private methods
      // @ts-ignore
      @effect #onChange() {
        expect(this.value).to.equal(1);

        done();
      }
    }

    const counter = new Counter();

    expect(counter.value).to.equal(0);

    counter.value++;

    expect(counter.value).to.equal(1);
  });

  it('should return a set of changed props', (done) => {
    class Counter {
      @observe accessor value = 0;

      @effect onChange(changes: Set<symbol | string>) {
        expect(changes.has('value')).to.be.true;

        done();
      }
    }

    const counter = new Counter();
    counter.value++;
  });

  it('should work as an even emitter', (done) => {
    class Counter extends EventTarget {
      @observe accessor value = 0;

      @effect onChange() {
        this.dispatchEvent(new Event('changed'));
      }
    }

    const counter = new Counter();

    counter.addEventListener('changed', () => {
      expect(counter.value).to.equal(1);

      done();
    });

    counter.value++;
  });

  it('should upgrade custom elements', (done) => {
    class Counter extends HTMLElement {
      @observe accessor value = 0;

      constructor() {
        super();

        expect(this.value).to.equal(100);
      }

      @effect onChange() {
        expect(this.value).to.equal(101);

        done();
      }
    }

    fixture<any>(html`<observable-1></observable-1>`).then((el) => {
      el.value = 100;

      customElements.define('observable-1', Counter);

      el.value++;
    });
  });
});
