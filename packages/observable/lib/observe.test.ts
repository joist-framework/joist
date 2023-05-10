import { expect } from '@open-wc/testing';

import { effect, observe } from './observe.js';

describe('observable: observe()', () => {
  it('should work with static accessors', (done) => {
    class Counter {
      @observe static accessor value = 0;
      @observe static accessor value2 = 0;
      @observe static accessor value3 = 0;

      @effect static onChange() {
        expect(Counter.value).to.equal(1);

        done();
      }
    }

    expect(Counter.value).to.equal(0);

    Counter.value++;

    expect(Counter.value).to.equal(1);
  });

  // it('should work with instance accessors', (done) => {
  //   class Counter {
  //     @observe accessor value = 0;

  //     @effect onChange() {
  //       expect(this.value).to.equal(1);

  //       done();
  //     }
  //   }

  //   const couter = new Counter();

  //   expect(couter.value).to.equal(0);

  //   couter.value++;

  //   expect(couter.value).to.equal(1);
  // });

  // it('should return a set of changed props', (done) => {
  //   class Counter {
  //     @observe accessor value = 0;

  //     @effect onChange(changes: Set<keyof this>) {
  //       expect(changes.has('value')).to.be.true;

  //       done();
  //     }
  //   }

  //   const couter = new Counter();
  //   couter.value++;
  // });

  // it('should upgrade custom elements', async () => {
  //   class CounterElement extends HTMLElement {
  //     @observe accessor value = 0;

  //     hello = 'world';
  //   }

  //   const el = await fixture<any>(html`<observable-el-1></observable-el-1>`);
  //   el.value = 100;

  //   console.log(el.value); // 100
  //   console.log(el.hello); // undefined

  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       customElements.define('observable-el-1', CounterElement);

  //       console.log(el.value); // 100
  //       console.log(el.hello); // world

  //       resolve();
  //     }, 100);
  //   });
  // });
});
