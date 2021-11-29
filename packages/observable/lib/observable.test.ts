import { expect } from '@open-wc/testing';

import { OnChange, Changes, observable, observe, Change } from './observable';

describe('property', () => {
  it('should detect and batch property updates', (done) => {
    @observable()
    class Counter implements OnChange {
      @observe() counter = 0;

      onChange(val: Changes) {
        expect(val.counter.previousValue).to.equal(0);
        expect(val.counter.value).to.equal(5);
        expect(val.counter.firstChange).to.equal(true);

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

  it('should detect and batch property updates for multiple properties', (done) => {
    @observable()
    class Person implements OnChange {
      @observe() fname = 'Danny';
      @observe() lname = 'Blue';

      onChange(val: Changes) {
        expect(val.fname).to.deep.equal(new Change('Foo', 'Danny', true));
        expect(val.lname).to.deep.equal(new Change('Bar', 'Blue', true));

        done();
      }
    }

    const person = new Person();

    person.fname = 'Foo';
    person.lname = 'Bar';
  });

  it('should let the user know when this is the first change', (done) => {
    @observable()
    class Counter implements OnChange {
      @observe() counter = 0;

      private first = true;

      onChange(val: Changes) {
        console.log(val);

        if (this.first) {
          expect(val.counter.firstChange).to.equal(true);
          this.first = false;
        } else {
          expect(val.counter.firstChange).to.equal(false);

          done();
        }
      }
    }

    const el = new Counter();

    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
    el.counter = el.counter + 1;
    el.counter = el.counter + 1;

    setTimeout(() => {
      el.counter = el.counter + 1;
    }, 0);
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
    class State extends EventTarget implements OnChange {
      onChange(val: Changes) {
        this.dispatchEvent(new CustomEvent('statechange', { detail: val }));
      }
    }

    @observable()
    class AppState extends State {
      @observe() counter = 0;
    }

    const state = new AppState();

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
