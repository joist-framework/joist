import { expect } from '@open-wc/testing';

import { OnChange, Changes, observable, observe } from './observable';

describe('property', () => {
  it('should detect and batch property updates', (done) => {
    @observable()
    class Counter implements OnChange {
      @observe() counter = 0;

      onChange(val: Changes) {
        expect(val.counter.value).to.equal(5);

        done();
      }
    }

    const el = new Counter();

    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
  });

  it('should detect and batch property updates with a custom element', (done) => {
    @observable()
    class MyEl extends HTMLElement implements OnChange {
      @observe() counter = 0;

      onChange(val: Changes) {
        expect(val.counter.value).to.equal(5);

        done();
      }
    }

    customElements.define('my-el-1', MyEl);

    const el = new MyEl();

    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
  });

  it('should detect and batch property updates with an EventEmitter', (done) => {
    @observable()
    class State extends EventTarget implements OnChange {
      @observe() counter = 0;

      onChange(val: Changes) {
        this.dispatchEvent(new CustomEvent('statechange', { detail: val }));
      }
    }

    const state = new State();

    state.addEventListener('statechange', (e) => {
      const evt = e as CustomEvent<Changes>;

      expect(evt.detail.counter.value).to.equal(5);

      done();
    });

    state.counter = state.counter + 1;
    state.counter = state.counter + 1;
    state.counter = state.counter + 1;
    state.counter = state.counter + 1;
    state.counter = state.counter + 1;
  });
});
