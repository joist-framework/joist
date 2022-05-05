import { expect, waitUntil } from '@open-wc/testing';

import { OnPropertyChanged, Changes, observable, observe, Change } from './observable';

describe('observable', () => {
  it('should detect and batch property updates', (done) => {
    @observable
    class Counter implements OnPropertyChanged {
      @observe counter = 0;

      onPropertyChanged(val: Changes) {
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
    @observable
    class Person implements OnPropertyChanged {
      @observe fname = 'Danny';
      @observe lname = 'Blue';

      onPropertyChanged(val: Changes) {
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
    @observable
    class Counter implements OnPropertyChanged {
      @observe fname = '';
      @observe lname = '';

      private first = true;

      onPropertyChanged(val: Changes) {
        if (this.first) {
          expect(val.fname.firstChange).to.equal(true);
          expect(val.lname.firstChange).to.equal(true);

          this.first = false;
        } else {
          expect(val.fname.firstChange).to.equal(false);
          expect(val.lname.firstChange).to.equal(false);

          done();
        }
      }
    }

    const el = new Counter();

    el.fname = 'Foo';
    el.lname = 'Bar';

    setTimeout(() => {
      el.fname = 'Foo-1';
      el.lname = 'Bar-1';
    }, 0);
  });

  it('should detect and batch property updates with a custom element', (done) => {
    @observable
    class MyEl extends HTMLElement implements OnPropertyChanged {
      @observe counter = 0;

      onPropertyChanged(val: Changes) {
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
    class State extends EventTarget implements OnPropertyChanged {
      onPropertyChanged(val: Changes) {
        this.dispatchEvent(new CustomEvent('statechange', { detail: val }));
      }
    }

    @observable
    class AppState extends State {
      @observe counter = 0;
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

  it('should handle changes that are made INSIDE of the changed callback', async () => {
    @observable
    class Counter implements OnPropertyChanged {
      changes: Changes[] = [];

      @observe counter = 0;
      @observe counterAsString = '0';

      onPropertyChanged(changes: Changes) {
        this.changes.push(changes);

        this.counterAsString = String(this.counter);
      }
    }

    const instance = new Counter();

    instance.counter = instance.counter + 1;

    await waitUntil(() => instance.counter === 1);

    expect(instance.changes).to.deep.equal([
      { counter: new Change(1, 0, true) },
      { counterAsString: new Change('1', '0', true) },
    ]);
  });
});
